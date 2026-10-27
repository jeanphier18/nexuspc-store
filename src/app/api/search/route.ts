import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/search";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.slice(0, 80) ?? "";
  const results = searchProducts(query, 8).map(({ product, categorySlug }) => ({
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    categorySlug,
    priceCents: product.priceCents,
    stock: product.stock,
    isNew: Boolean(product.isNew),
  }));

  return NextResponse.json(
    { query, results },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
