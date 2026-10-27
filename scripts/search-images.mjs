/**
 * Explorador de Openverse para la curaduría de fotos de producto.
 * Uso: node scripts/search-images.mjs "graphics card" [limit]
 */
const query = process.argv[2] ?? "graphics card";
const limit = Number(process.argv[3] ?? 12);

const params = new URLSearchParams({
  q: query,
  license: "cc0,pdm,by",
  license_type: "commercial",
  size: "large",
  aspect_ratio: "wide",
  page_size: String(limit),
  mature: "false",
});

const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
  headers: { "User-Agent": "NEXUS-PC-demo/1.0 (image curation)" },
  signal: AbortSignal.timeout(25000),
});

if (!res.ok) {
  console.error("Openverse error", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
console.log(`query=${query} total=${data.result_count}`);

for (const item of data.results ?? []) {
  console.log(
    [
      item.id.slice(0, 8),
      `${item.width}x${item.height}`,
      item.license.toUpperCase(),
      item.creator ?? "unknown",
      item.title?.slice(0, 60) ?? "",
      item.url,
    ].join(" | "),
  );
}
