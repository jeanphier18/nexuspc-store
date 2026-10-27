/**
 * Procesa las imágenes seleccionadas de Wikimedia Commons:
 * - WebP 1600×1200 para la tienda.
 * - JPG 1200×630 para Open Graph.
 * - Manifiesto reproducible y créditos tipados.
 *
 * Uso: node scripts/build-images.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const CANDIDATES_FILE = path.join(ROOT, ".image-candidates", "candidates.json");
const SELECTION_FILE = path.join(ROOT, "scripts", "image-selection.json");
const SOURCES_FILE = path.join(ROOT, "scripts", "image-sources.json");
const CREDITS_FILE = path.join(ROOT, "src", "data", "image-credits.ts");
const OUTPUT_DIR = path.join(ROOT, "public", "products");

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

async function download(url) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "NEXUS-PC-demo/1.0 (image processing)" },
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
    }
  }
}

function hiResThumb(url) {
  if (!url) return null;
  return url.replace(/\/500px-/, "/1600px-");
}

const sources = [];
let ok = 0;
let failed = 0;

for (const [id, pick] of Object.entries(selection)) {
  const pool = candidates[pick.pool];
  const item = pool?.[pick.index];

  if (!item) {
    console.error(`FALTA ${id}: ${pick.pool}[${pick.index}]`);
    failed += 1;
    continue;
  }

  const sourceUrl = hiResThumb(item.thumb) ?? item.url;
  process.stdout.write(`${id} … `);

  try {
    let buffer;
    try {
      buffer = await download(sourceUrl);
    } catch {
      buffer = await download(item.url);
    }
    const base = sharp(buffer)
      .rotate()
      .resize(1600, 1200, { fit: "cover", position: "attention" })
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

    await writeFile(path.join(OUTPUT_DIR, `${id}.webp`), webp);
    await writeFile(path.join(OUTPUT_DIR, `${id}-og.jpg`), og);

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
    ok += 1;
    console.log("ok");
  } catch (error) {
    failed += 1;
    console.error(`ERROR ${error.message}`);
  }
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

console.log(`\n${ok} imágenes procesadas, ${failed} errores.`);
console.log(`Manifiesto: scripts/image-sources.json`);
console.log(`Créditos: src/data/image-credits.ts`);
