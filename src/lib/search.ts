import { categories } from "@/config/nav";
import { products, type Product } from "@/data/catalog";

export type SearchResult = {
  product: Product;
  categorySlug: string;
  score: number;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const categorySlugs = new Map(categories.map((item) => [item.key, item.slug]));

export function searchProducts(query: string, limit = 8): SearchResult[] {
  const normalized = normalize(query);
  if (normalized.length < 2) return [];

  const tokens = normalized.split(" ").filter(Boolean);
  const results: SearchResult[] = [];

  for (const product of products) {
    const name = normalize(product.name);
    const brand = normalize(product.brand);
    const category = normalize(product.category);
    const specs = normalize(product.specs.map((spec) => spec.value).join(" "));
    const haystack = `${name} ${brand} ${category} ${specs} ${normalize(product.slug)}`;

    if (!tokens.every((token) => haystack.includes(token))) continue;

    let score = 0;
    if (name === normalized) score += 120;
    if (name.startsWith(normalized)) score += 70;
    if (name.includes(normalized)) score += 45;
    if (brand === normalized) score += 40;
    if (brand.startsWith(normalized)) score += 30;
    if (category.includes(normalized)) score += 20;
    for (const token of tokens) {
      if (name.split(" ").includes(token)) score += 14;
      if (brand.split(" ").includes(token)) score += 10;
      if (haystack.includes(token)) score += 4;
    }
    score += product.rating * 2;
    if (product.isNew) score += 2;

    results.push({
      product,
      categorySlug: categorySlugs.get(product.category) ?? "tienda",
      score,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
