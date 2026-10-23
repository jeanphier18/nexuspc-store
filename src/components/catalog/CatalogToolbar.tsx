"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { buttonVariants } from "@/components/ui/Button";
import type { CategoryKey } from "@/config/nav";
import { useRouter } from "@/i18n/navigation";
import {
  activeFilterCount,
  catalogHref,
  type CatalogQuery,
  type SortKey,
} from "@/lib/catalog-filters";
import { cn } from "@/lib/cn";

const SORT_OPTIONS: { value: SortKey; labelKey: string }[] = [
  { value: "relevance", labelKey: "sortRelevance" },
  { value: "price-asc", labelKey: "sortPriceAsc" },
  { value: "price-desc", labelKey: "sortPriceDesc" },
  { value: "rating", labelKey: "sortRating" },
  { value: "new", labelKey: "sortNew" },
];

export function CatalogToolbar({
  basePath,
  query,
  resultCount,
  brands,
  categories,
  activeCategory,
  totalProducts,
}: {
  basePath: string;
  query: CatalogQuery;
  resultCount: number;
  brands: { brand: string; count: number }[];
  categories?: { key: CategoryKey; slug: string; count: number }[];
  activeCategory?: CategoryKey;
  totalProducts: number;
}) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [term, setTerm] = useState(query.q);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const queryRef = useRef(query);
  queryRef.current = query;

  const navigate = (next: CatalogQuery) => {
    startTransition(() => {
      router.replace(catalogHref(basePath, next), { scroll: false });
    });
  };

  useEffect(() => {
    setTerm(query.q);
  }, [query.q]);

  useEffect(() => {
    const current = queryRef.current;
    const next = term.trim();

    if (next === current.q) return;

    const handle = window.setTimeout(() => {
      startTransition(() => {
        router.replace(catalogHref(basePath, { ...queryRef.current, q: next }), {
          scroll: false,
        });
      });
    }, 320);

    return () => window.clearTimeout(handle);
  }, [term, basePath, router]);

  const filterCount = activeFilterCount(query);

  return (
    <div aria-busy={pending} className="transition-opacity">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint"
          />
          <input
            type="text"
            inputMode="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            aria-label={t("searchLabel")}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-sm border border-line bg-surface/50 pl-9 pr-9 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
          />
          {term ? (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label={t("clearFilters")}
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="flex gap-3 sm:contents">
          <div className="relative flex-1 sm:flex-none">
            <label htmlFor="catalog-sort" className="sr-only">
              {t("sort")}
            </label>
            <select
              id="catalog-sort"
              value={query.sort}
              onChange={(event) =>
                navigate({ ...query, sort: event.target.value as SortKey })
              }
              className="h-11 w-full appearance-none rounded-sm border border-line bg-surface/50 pl-3.5 pr-10 text-[13px] text-foreground transition-colors focus:border-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 sm:w-auto"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint"
            />
          </div>

          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className={cn(
              buttonVariants({ variant: "outline", size: "md" }),
              "shrink-0 lg:hidden",
            )}
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            {t("filters")}
            {filterCount ? (
              <span className="ml-0.5 rounded-full bg-accent/15 px-1.5 font-mono text-[10px] text-accent">
                {filterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p
          aria-live="polite"
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.14em] text-faint transition-opacity",
            pending && "opacity-50",
          )}
        >
          {t("results", { count: resultCount })}
        </p>
        {pending ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent/80">
            {t("updating")}
          </span>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        className="drawer-panel m-0 ml-auto h-dvh max-h-dvh w-[88%] max-w-sm border-l border-line bg-background p-0 text-foreground backdrop:bg-background/85 backdrop:backdrop-blur-sm lg:hidden"
      >
        <div
          className="flex h-full flex-col"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) {
              dialogRef.current?.close();
            }
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <p className="font-display text-sm">{t("filters")}</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={t("closeFilters")}
              className="flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
            <CatalogSidebar
              instance="dialog"
              basePath={basePath}
              query={query}
              brands={brands}
              categories={categories}
              activeCategory={activeCategory}
              totalProducts={totalProducts}
            />
          </div>

          <div className="border-t border-line p-5">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "w-full",
              )}
            >
              {t("results", { count: resultCount })}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
