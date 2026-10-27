import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CatalogLayout } from "@/components/catalog/CatalogLayout";
import { BackgroundArt } from "@/components/layout/BackgroundArt";
import { ProductCard } from "@/components/product/ProductCard";
import { categories } from "@/config/nav";
import { getProductsByCategory, products } from "@/data/catalog";
import {
  applyCatalogQuery,
  brandFacets,
  parseCatalogQuery,
} from "@/lib/catalog-filters";
import { alternatesFor } from "@/lib/metadata";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });

  return {
    title: t("title"),
    description: t("body"),
    alternates: alternatesFor(locale, "/tienda"),
  };
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("catalog");
  const query = parseCatalogQuery(rawSearchParams);
  const items = applyCatalogQuery(products, query);

  const categoryFacets = categories.map((category) => ({
    key: category.key,
    slug: category.slug,
    count: getProductsByCategory(category.key).length,
  }));

  return (
    <main className="relative isolate mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <BackgroundArt
        items={[
          {
            id: "catalog-motherboard",
            src: "/products/mobo-msi-a.webp",
            label: "X870E",
            side: "right",
            top: "4%",
            depth: 0.75,
            width: "clamp(180px, 13vw, 220px)",
          },
          {
            id: "catalog-ssd",
            src: "/products/ssd-sn850-a.webp",
            label: "NVMe",
            side: "left",
            top: "58%",
            depth: 1.25,
            width: "clamp(170px, 12vw, 210px)",
          },
        ]}
      />
      <header className="max-w-2xl">
        <p className="eyebrow">{t("kicker")}</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{t("body")}</p>
      </header>

      <CatalogLayout
        basePath="/tienda"
        query={query}
        brands={brandFacets(products)}
        categories={categoryFacets}
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
