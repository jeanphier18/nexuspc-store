import { SearchX, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type * as React from "react";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { buttonVariants } from "@/components/ui/Button";
import type { CategoryKey } from "@/config/nav";
import { Link } from "@/i18n/navigation";
import {
  catalogHref,
  PRICE_LABEL_KEYS,
  type CatalogQuery,
} from "@/lib/catalog-filters";
import { cn } from "@/lib/cn";

type Chip = { key: string; label: string; href: string };

export async function CatalogLayout({
  basePath,
  query,
  brands,
  categories,
  activeCategory,
  totalProducts,
  resultCount,
  children,
}: {
  basePath: string;
  query: CatalogQuery;
  brands: { brand: string; count: number }[];
  categories?: { key: CategoryKey; slug: string; count: number }[];
  activeCategory?: CategoryKey;
  totalProducts: number;
  resultCount: number;
  children: React.ReactNode;
}) {
  const t = await getTranslations("catalog");

  const chips: Chip[] = [];

  if (query.q) {
    chips.push({
      key: "q",
      label: `“${query.q}”`,
      href: catalogHref(basePath, { ...query, q: "" }),
    });
  }

  for (const brand of query.brands) {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      href: catalogHref(basePath, {
        ...query,
        brands: query.brands.filter((item) => item !== brand),
      }),
    });
  }

  if (query.inStock) {
    chips.push({
      key: "stock",
      label: t("inStockOnly"),
      href: catalogHref(basePath, { ...query, inStock: false }),
    });
  }

  if (query.price !== "all") {
    chips.push({
      key: "price",
      label: t(PRICE_LABEL_KEYS[query.price]),
      href: catalogHref(basePath, { ...query, price: "all" }),
    });
  }

  return (
    <div className="mt-10 grid items-start gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100svh-7.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
        <CatalogSidebar
          instance="sidebar"
          basePath={basePath}
          query={query}
          brands={brands}
          categories={categories}
          activeCategory={activeCategory}
          totalProducts={totalProducts}
        />
      </aside>

      <div className="min-w-0">
        <CatalogToolbar
          basePath={basePath}
          query={query}
          resultCount={resultCount}
          brands={brands}
          categories={categories}
          activeCategory={activeCategory}
          totalProducts={totalProducts}
        />

        {chips.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              {t("activeFilters")}
            </span>
            {chips.map((chip) => (
              <Link
                key={chip.key}
                href={chip.href}
                aria-label={t("removeFilter", { filter: chip.label })}
                className="group inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface/60 py-1 pl-3 pr-2 text-[11px] text-muted transition-colors duration-fast hover:border-danger/50 hover:text-foreground"
              >
                <span className="max-w-[16ch] truncate">{chip.label}</span>
                <X
                  aria-hidden="true"
                  className="size-3 text-faint transition-colors group-hover:text-danger"
                />
              </Link>
            ))}
            {chips.length > 1 ? (
              <Link
                href={basePath}
                className="ml-1 text-[11px] text-accent underline-offset-4 hover:underline"
              >
                {t("clearFilters")}
              </Link>
            ) : null}
          </div>
        ) : null}

        {resultCount === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-line bg-surface/40 px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full border border-line bg-surface-2/60">
              <SearchX aria-hidden="true" className="size-5 text-faint" />
            </span>
            <p className="mt-4 font-display text-lg">{t("empty")}</p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">
              {t("emptyHint")}
            </p>
            <Link
              href={basePath}
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "mt-6",
              )}
            >
              {t("emptyCta")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
