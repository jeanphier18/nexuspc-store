import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SearchBox } from "@/components/search/SearchBox";
import { ProductCard } from "@/components/product/ProductCard";
import { Card } from "@/components/ui/Card";
import { searchProducts } from "@/lib/search";
import { alternatesFor } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });

  return {
    title: t("pageTitle"),
    description: t("pageBody"),
    robots: { index: false, follow: true },
    alternates: alternatesFor(locale, "/buscar"),
  };
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolved = await searchParams;
  setRequestLocale(locale);

  const raw = Array.isArray(resolved.q) ? resolved.q[0] : resolved.q;
  const query = (raw ?? "").trim().slice(0, 80);
  const t = await getTranslations("search");
  const results = searchProducts(query, 24);

  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {t("pageTitle")}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {t("pageBody")}
        </p>

        <SearchBox initialQuery={query} />

        {query.length >= 2 ? (
          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              {t("resultsCount", { count: results.length, query })}
            </p>

            {results.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map(({ product }) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <Card className="mt-5 flex flex-col items-center px-6 py-14 text-center">
                <p className="font-display text-xl">{t("noResults")}</p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  {t("noResultsHint")}
                </p>
              </Card>
            )}
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-line bg-surface/40 p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {t("examples")}
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
              {t("emptyHint")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
