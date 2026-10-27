/**
 * Constructor offline: usa los thumbs locales de .image-candidates.
 * Sirve como respaldo cuando Wikimedia limita las descargas.
 * No pisa archivos de alta resolución ya existentes (salvo --force).
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const CANDIDATES_FILE = path.join(ROOT, ".image-candidates", "candidates.json");
const SELECTION_FILE = path.join(ROOT, "scripts", "image-selection.json");
const SOURCES_FILE = path.join(ROOT, "scripts", "image-sources.json");
const CREDITS_FILE = path.join(ROOT, "src", "data", "image-credits.ts");
const OUTPUT_DIR = path.join(ROOT, "public", "products");
const force = process.argv.includes("--force");

const candidates = JSON.parse(await readFile(CANDIDATES_FILE, "utf8"));
const selection = JSON.parse(await readFile(SELECTION_FILE, "utf8"));
await mkdir(OUTPUT_DIR, { recursive: true });

const overlay = Buffer.from(`<svg width="1600" height="1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tint" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c3aed" stop-opacity="0.10"/>
      <stop offset="0.55" stop-color="#07070d" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#00e5ff" stop-opacity="0.09"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.78">
      <stop offset="0.55" stop-color="#07070d" stop-opacity="0"/>
      <stop offset="1" stop-color="#07070d" stop-opacity="0.24"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1200" fill="url(#tint)"/>
  <rect width="1600" height="1200" fill="url(#vignette)"/>
</svg>`);

const ogOverlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stop-color="#07070d" stop-opacity="0"/>
      <stop offset="1" stop-color="#07070d" stop-opacity="0.65"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
</svg>`);

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

const sources = [];
let built = 0;
let skipped = 0;
let failed = 0;

for (const [id, pick] of Object.entries(selection)) {
  const item = candidates[pick.pool]?.[pick.index];
  if (!item) {
    console.error(`FALTA ${id}: ${pick.pool}[${pick.index}]`);
    failed += 1;
    continue;
  }

  const webpPath = path.join(OUTPUT_DIR, `${id}.webp`);
  const ogPath = path.join(OUTPUT_DIR, `${id}-og.jpg`);
  const already = (await exists(webpPath)) && (await exists(ogPath));

  if (!already || force) {
    const localThumb = path.join(ROOT, ".image-candidates", pick.pool, `${String(pick.index).padStart(2, "0")}.jpg`);
    if (!(await exists(localThumb))) {
      console.error(`FALTA thumb ${id}: ${localThumb}`);
      failed += 1;
      continue;
    }

    process.stdout.write(`${id} … `);
    try {
      const base = sharp(localThumb)
        .resize(1600, 1200, { fit: "cover", position: "attention", kernel: "lanczos3" })
        .modulate({ saturation: 0.84, brightness: 0.93 });

      const webp = await base
        .clone()
        .composite([{ input: overlay }])
        .webp({ quality: 83, effort: 5 })
        .toBuffer();

      const og = await base
        .clone()
        .resize(1200, 630, { fit: "cover", position: "attention" })
        .composite([{ input: ogOverlay }])
        .jpeg({ quality: 84, mozjpeg: true })
        .toBuffer();

      await writeFile(webpPath, webp);
      await writeFile(ogPath, og);
      built += 1;
      console.log("ok");
    } catch (error) {
      failed += 1;
      console.error(`ERROR ${error.message}`);
      continue;
    }
  } else {
    skipped += 1;
  }

  sources.push({
    id,
    title: item.title,
    creator: item.creator,
    license: item.license,
    licenseUrl: item.licenseUrl,
    source: item.source,
    card: `/products/${id}.webp`,
    og: `/products/${id}-og.jpg`,
  });
}

await writeFile(SOURCES_FILE, `${JSON.stringify(sources, null, 2)}\n`);

const credits = sources
  .map(
    (item) => `  {
    id: ${JSON.stringify(item.id)},
    title: ${JSON.stringify(item.title)},
    creator: ${JSON.stringify(item.creator)},
    license: ${JSON.stringify(item.license)},
    licenseUrl: ${JSON.stringify(item.licenseUrl)},
    source: ${JSON.stringify(item.source)},
  },`,
  )
  .join("\n");

const file = `// Generado por scripts/build-images.mjs. No editar a mano.
export type ImageCredit = {
  id: string;
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  source: string;
};

export const imageCredits: ImageCredit[] = [
${credits}
];
`;

await writeFile(CREDITS_FILE, file);
console.log(`\n${built} generadas, ${skipped} conservadas, ${failed} errores.`);
