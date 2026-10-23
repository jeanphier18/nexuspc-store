import { getProduct, type Product, type SpecKey } from "@/data/catalog";

export const MAX_COMPARE = 4;

/** Canonical order for spec rows in the comparison table. */
export const SPEC_ORDER: SpecKey[] = [
  "type",
  "chipset",
  "socket",
  "cores",
  "threads",
  "boost",
  "vram",
  "memory",
  "speed",
  "capacity",
  "interface",
  "formFactor",
  "read",
  "write",
  "latency",
  "refresh",
  "resolution",
  "response",
  "panel",
  "size",
  "gpuLength",
  "moboSupport",
  "wattage",
  "efficiency",
  "modular",
  "tdp",
  "noise",
  "rpm",
  "connection",
  "ports",
  "battery",
  "weight",
];

export function parseCompareSlugs(
  value: string | string[] | undefined,
): string[] {
  const raw = Array.isArray(value) ? value.join(",") : (value ?? "");
  const seen = new Set<string>();
  const slugs: string[] = [];

  for (const part of raw.split(",")) {
    const slug = part.trim();

    if (!slug || seen.has(slug) || !getProduct(slug)) continue;

    seen.add(slug);
    slugs.push(slug);

    if (slugs.length >= MAX_COMPARE) break;
  }

  return slugs;
}

export function resolveCompareProducts(
  value: string | string[] | undefined,
): Product[] {
  return parseCompareSlugs(value).flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });
}

export function compareHref(slugs: string[]): string {
  const valid = slugs.filter(Boolean);

  return valid.length > 0 ? `/comparar?p=${valid.join(",")}` : "/comparar";
}
