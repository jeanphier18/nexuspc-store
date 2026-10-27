/**
 * Descarga candidatos de Wikimedia Commons y genera hojas de contacto.
 * Solo licencias CC0, dominio público y CC BY (sin SA / NC / ND).
 * Uso: node scripts/curate-images.mjs [pool]
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, ".image-candidates");
const META_FILE = path.join(OUT_DIR, "candidates.json");

const POOLS = {
  gpu: "graphics card",
  cpu: "computer processor chip",
  motherboard: "computer motherboard",
  ram: "computer memory modules",
  storage: "solid state drive",
  psu: "computer power supply",
  cases: "pc case",
  monitors: "computer monitor",
  mouse: "gaming mouse",
  keyboard: "mechanical keyboard",
  headset: "headphones",
  cooling: "cpu cooler",
};

const BLOCKED_TITLE =
  /(chart|graph|trend|diagram|price|benchmark|youtube|screenshot|drawing|sketchfab|vr headset|famicom|game boy|playstation|xbox|nintendo|comparison|in water|trinitron|logo|icon|poster|box art|packaging|thermal paste|adapter)/i;

const requestedPool = process.argv[2];
const customQuery = process.argv[3];
const candidateLimit = Number(process.argv[4] ?? 16);
const pools = requestedPool
  ? { [requestedPool]: customQuery ?? POOLS[requestedPool] }
  : POOLS;

if (!pools[Object.keys(pools)[0]]) {
  console.error(
    `Pool desconocido. Opciones: ${Object.keys(POOLS).join(", ")} · o pasa "pool" "consulta"`,
  );
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

let allMeta = {};
try {
  allMeta = JSON.parse(await readFile(META_FILE, "utf8"));
} catch {
  allMeta = {};
}

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function licenseInfo(meta = {}) {
  const short = meta.LicenseShortName?.value ?? "";
  const code = (meta.License?.value ?? "").toLowerCase();
  const url = meta.LicenseUrl?.value ?? "";
  const label = `${short} ${code} ${url}`.toLowerCase();

  const allowed =
    /(cc0|cc-zero|public domain|pd-|pd\b)/.test(label) ||
    (/cc by/.test(label) && !/sa|nc|nd|share/.test(label));

  return {
    allowed,
    short: stripHtml(short) || "Desconocida",
    url,
    code,
  };
}

async function search(query, limit = 50) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    gsrsort: "relevance",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: "500",
    format: "json",
    formatversion: "2",
  });

  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": "NEXUS-PC-demo/1.0 (image curation)" },
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`Wikimedia ${res.status}`);
  return res.json();
}

async function download(url, file) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "NEXUS-PC-demo/1.0 (image curation)" },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(file, buffer);
      return true;
    } catch (error) {
      if (attempt === 3) {
        console.warn(`  ! ${url.slice(0, 80)} → ${error.message}`);
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 900 * attempt));
    }
  }
  return false;
}

async function contactSheet(pool, files, meta) {
  const cols = 4;
  const cellW = 330;
  const cellH = 225;
  const rows = Math.ceil(files.length / cols);
  const composites = [];

  for (let index = 0; index < files.length; index += 1) {
    const x = (index % cols) * cellW;
    const y = Math.floor(index / cols) * cellH;
    try {
      const image = await sharp(files[index])
        .resize(cellW, cellH, { fit: "cover", position: "attention" })
        .toBuffer();
      const label = Buffer.from(
        `<svg width="${cellW}" height="${cellH}" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="44" height="30" rx="6" fill="#07070d" opacity="0.82"/>
          <text x="28" y="27" font-family="monospace" font-size="17" fill="#00e5ff" text-anchor="middle">${index}</text>
          <rect x="0" y="${cellH - 26}" width="${cellW}" height="26" fill="#07070d" opacity="0.72"/>
          <text x="8" y="${cellH - 8}" font-family="monospace" font-size="11" fill="#e7eaf3">${meta[index].license.slice(0, 20)} · ${meta[index].creator.slice(0, 34)}</text>
        </svg>`,
      );
      composites.push({ input: image, left: x, top: y });
      composites.push({ input: label, left: x, top: y });
    } catch (error) {
      console.warn(`  ! sheet ${files[index]}: ${error.message}`);
    }
  }

  await sharp({
    create: {
      width: cellW * cols,
      height: cellH * rows,
      channels: 3,
      background: "#0b0b14",
    },
  })
    .composite(composites)
    .jpeg({ quality: 86 })
    .toFile(path.join(OUT_DIR, `contact-${pool}.jpg`));
}

for (const [pool, query] of Object.entries(pools)) {
  console.log(`\n[${pool}] ${query}`);
  try {
    const data = await search(query);
    const pages = data.query?.pages ?? [];
    const seen = new Set();
    const items = [];

    for (const page of pages) {
      const info = page.imageinfo?.[0];
      if (!info) continue;
      const ext = info.extmetadata ?? {};
      const license = licenseInfo(ext);
      if (!license.allowed) continue;
      if (!/^image\/(jpeg|png|webp)$/.test(info.mime ?? "")) continue;
      if ((info.width ?? 0) < 1200 || (info.height ?? 0) < 650) continue;
      const ratio = info.width / info.height;
      if (ratio < 0.95 || ratio > 3) continue;
      if (BLOCKED_TITLE.test(page.title ?? "")) continue;
      if (seen.has(page.title)) continue;
      seen.add(page.title);
      items.push({ page, info, ext, license });
      if (items.length >= candidateLimit) break;
    }

    console.log(`  ${pages.length} resultados · ${items.length} candidatos`);

    const poolDir = path.join(OUT_DIR, pool);
    await mkdir(poolDir, { recursive: true });

    const files = [];
    const meta = [];
    for (let index = 0; index < items.length; index += 1) {
      const { page, info, ext, license } = items[index];
      const file = path.join(poolDir, `${String(index).padStart(2, "0")}.jpg`);
      const ok = await download(info.thumburl ?? info.url, file);
      if (!ok) continue;

      files.push(file);
      meta.push({
        index: files.length - 1,
        title: page.title?.replace(/^File:/, ""),
        creator: stripHtml(ext.Artist?.value) || "Desconocido",
        credit: stripHtml(ext.Credit?.value),
        license: license.short,
        licenseUrl: license.url,
        source: info.descriptionurl,
        url: info.url,
        thumb: info.thumburl,
        width: info.width,
        height: info.height,
        pool,
      });
      process.stdout.write(`  ${index} ok\n`);
    }

    await contactSheet(pool, files, meta);
    allMeta[pool] = meta;
    console.log(`  hoja: .image-candidates/contact-${pool}.jpg`);
  } catch (error) {
    console.error(`  ERROR: ${error.message}`);
  }
}

await writeFile(META_FILE, JSON.stringify(allMeta, null, 2));
console.log(`\nMetadatos: ${META_FILE}`);
