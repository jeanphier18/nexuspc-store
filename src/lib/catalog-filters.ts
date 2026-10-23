import type { Product } from "@/data/catalog";
import { discountPercent } from "@/lib/format";

export type SortKey =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "new"
  | "discount";

export type PriceBucket =
  | "all"
  | "under200"
  | "200-500"
  | "500-1000"
  | "over1000";

export type CatalogQuery = {
  q: string;
  brands: string[];
  inStock: boolean;
  price: PriceBucket;
  sort: SortKey;
};

export const SORT_KEYS: SortKey[] = [
  "relevance",
  "price-asc",
  "price-desc",
  "rating",
  "new",
  "discount",
];

export const PRICE_BUCKETS: PriceBucket[] = [
  "all",
  "under200",
  "200-500",
  "500-1000",
  "over1000",
];

export const PRICE_LABEL_KEYS: Record<PriceBucket, string> = {
  all: "priceAll",
  under200: "priceUnder200",
  "200-500": "price200to500",
  "500-1000": "price500to1000",
  over1000: "priceOver1000",
};

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export function parseCatalogQuery(
  params: SearchParams,
  defaultSort: SortKey = "relevance",
): CatalogQuery {
  const rawSort = first(params.sort);
  const price = first(params.price);

  return {
    q: (first(params.q) ?? "").trim().slice(0, 80),
    brands: (first(params.brand) ?? "")
      .split(",")
      .map((brand) => brand.trim())
      .filter(Boolean)
      .slice(0, 16),
    inStock: first(params.stock) === "in",
    price: PRICE_BUCKETS.includes(price as PriceBucket)
      ? (price as PriceBucket)
      : "all",
    sort: SORT_KEYS.includes(rawSort as SortKey)
      ? (rawSort as SortKey)
      : defaultSort,
  };
}

export function catalogHref(basePath: string, query: CatalogQuery): string {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.brands.length) params.set("brand", query.brands.join(","));
  if (query.inStock) params.set("stock", "in");
  if (query.price !== "all") params.set("price", query.price);
  if (query.sort !== "relevance") params.set("sort", query.sort);

  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesPrice(priceCents: number, bucket: PriceBucket): boolean {
  switch (bucket) {
    case "under200":
      return priceCents < 20_000;
    case "200-500":
      return priceCents >= 20_000 && priceCents < 50_000;
    case "500-1000":
      return priceCents >= 50_000 && priceCents < 100_000;
    case "over1000":
      return priceCents >= 100_000;
    default:
      return true;
  }
}

const comparators: Record<
  Exclude<SortKey, "relevance">,
  (a: Product, b: Product) => number
> = {
  "price-asc": (a, b) => a.priceCents - b.priceCents,
  "price-desc": (a, b) => b.priceCents - a.priceCents,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  new: (a, b) =>
    Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) ||
    b.rating - a.rating,
  discount: (a, b) =>
    (discountPercent(b.priceCents, b.compareAtCents) ?? 0) -
    (discountPercent(a.priceCents, a.compareAtCents) ?? 0),
};

export function applyCatalogQuery(
  items: Product[],
  query: CatalogQuery,
): Product[] {
  const needle = normalize(query.q);

  const filtered = items.filter((product) => {
    if (needle) {
      const haystack = normalize(`${product.name} ${product.brand}`);
      if (!haystack.includes(needle)) return false;
    }

    if (query.brands.length && !query.brands.includes(product.brand)) {
      return false;
    }

    if (query.inStock && product.stock === "out") return false;

    return matchesPrice(product.priceCents, query.price);
  });

  if (query.sort === "relevance") return filtered;

  return [...filtered].sort(comparators[query.sort]);
}

export function brandFacets(items: Product[]): { brand: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const product of items) {
    counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => a.brand.localeCompare(b.brand));
}

export function activeFilterCount(query: CatalogQuery): number {
  return (
    query.brands.length +
    Number(query.inStock) +
    Number(query.price !== "all") +
    Number(Boolean(query.q))
  );
}
