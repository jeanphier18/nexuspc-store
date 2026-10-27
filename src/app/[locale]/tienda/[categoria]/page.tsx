import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CatalogLayout } from "@/components/catalog/CatalogLayout";
import { BackgroundArt } from "@/components/layout/BackgroundArt";
import { ProductCard } from "@/components/product/ProductCard";
import { categoryIcons } from "@/config/category-icons";
import { categories } from "@/config/nav";
import { getProductsByCategory, products } from "@/data/catalog";
import { getProductImage } from "@/data/product-images";
import { Link } from "@/i18n/navigation";
import {
  applyCatalogQuery,
  brandFacets,
  catalogHref,
  parseCatalogQuery,
} from "@/lib/catalog-filters";
import { alternatesFor } from "@/lib/metadata";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categoria: string }>;
}): Promise<Metadata> {
  const { locale, categoria } = await params;
  const category = categories.find((item) => item.slug === categoria);

  if (!category) return {};

  const t = await getTranslations({ locale, namespace: "catalog" });
  const navT = await getTranslations({ locale, namespace: "nav" });

  return {
    title: navT(`categories.${category.key}`),
    description: t(`categoryBody.${category.key}`),
    alternates: alternatesFor(locale, `/tienda/${category.slug}`),
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; categoria: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale, categoria } = await params;
  setRequestLocale(locale);

  const category = categories.find((item) => item.slug === categoria);
  if (!category) notFound();

  const rawSearchParams = await searchParams;
  const t = await getTranslations("catalog");
  const navT = await getTranslations("nav");

  const query = parseCatalogQuery(rawSearchParams);
  const categoryProducts = getProductsByCategory(category.key);
  const items = applyCatalogQuery(categoryProducts, query);
  const Icon = categoryIcons[category.key];

  const categoryFacets = categories.map((item) => ({
    key: item.key,
    slug: item.slug,
    count: getProductsByCategory(item.key).length,
  }));

  const label = navT(`categories.${category.key}`);
  const firstProduct = categoryProducts[0];
  const artImage = firstProduct ? getProductImage(firstProduct) : null;

  return (
    <main className="relative isolate mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      {artImage ? (
        <BackgroundArt
          items={[
            {
              id: `category-${category.key}`,
              src: artImage.src,
              label: category.key.toUpperCase(),
              side: "right",
              top: "3%",
              depth: 0.85,
              width: "clamp(180px, 13vw, 220px)",
            },
          ]}
        />
      ) : null}
      <header className="border-b border-line/70 pb-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint"
        >
          <Link
            href={catalogHref("/tienda", query)}
            className="transition-colors duration-fast hover:text-foreground"
          >
            {navT("shop")}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-muted">{label}</span>
        </nav>

        <div className="mt-6 flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2/60 text-accent">
            <Icon aria-hidden="true" className="size-6" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {label}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {t(`categoryBody.${category.key}`)}
            </p>
          </div>
        </div>
      </header>

      <CatalogLayout
        basePath={`/tienda/${category.slug}`}
        query={query}
        brands={brandFacets(categoryProducts)}
        categories={categoryFacets}
        activeCategory={category.key}
        totalProducts={products.length}
        resultCount={items.length}
      >
        {items.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            locale={locale}
          />
        ))}
      </CatalogLayout>
    </main>
  );
}
