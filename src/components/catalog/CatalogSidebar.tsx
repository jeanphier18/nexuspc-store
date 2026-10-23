"use client";

import { Check, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { useTransition } from "react";
import { buttonVariants } from "@/components/ui/Button";
import { categoryIcons } from "@/config/category-icons";
import type { CategoryKey } from "@/config/nav";
import { Link, useRouter } from "@/i18n/navigation";
import {
  catalogHref,
  PRICE_LABEL_KEYS,
  type CatalogQuery,
  type PriceBucket,
} from "@/lib/catalog-filters";
import { cn } from "@/lib/cn";

const PRICE_OPTIONS: PriceBucket[] = [
  "all",
  "under200",
  "200-500",
  "500-1000",
  "over1000",
];

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function CatalogSidebar({
  basePath,
  query,
  brands,
  categories,
  activeCategory,
  totalProducts,
  instance,
  className,
}: {
  basePath: string;
  query: CatalogQuery;
  brands: { brand: string; count: number }[];
  categories?: { key: CategoryKey; slug: string; count: number }[];
  activeCategory?: CategoryKey;
  totalProducts: number;
  instance: string;
  className?: string;
}) {
  const t = useTranslations("catalog");
  const nav = useTranslations("nav");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const update = (patch: Partial<CatalogQuery>) => {
    const next = { ...query, ...patch };
    startTransition(() => {
      router.replace(catalogHref(basePath, next), { scroll: false });
    });
  };

  const toggleBrand = (brand: string) => {
    update({
      brands: query.brands.includes(brand)
        ? query.brands.filter((item) => item !== brand)
        : [...query.brands, brand],
    });
  };

  const hasFilters =
    query.brands.length > 0 ||
    query.inStock ||
    query.price !== "all" ||
    query.q !== "";

  return (
    <div
      aria-busy={pending}
      className={cn(
        "space-y-8 transition-opacity",
        pending && "pointer-events-none opacity-60",
        className,
      )}
    >
      {categories?.length ? (
        <Group title={t("category")}>
          <ul className="space-y-0.5">
            <li>
              <Link
                href={catalogHref("/tienda", query)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xs px-2 py-1.5 text-[13px] transition-colors duration-fast",
                  activeCategory
                    ? "text-muted hover:bg-surface/70 hover:text-foreground"
                    : "bg-accent/10 text-foreground ring-1 ring-inset ring-accent/30",
                )}
              >
                <span>{t("allCategories")}</span>
                <span className="font-mono text-[10px] text-faint">
                  {totalProducts}
                </span>
              </Link>
            </li>

            {categories.map((category) => {
              const Icon = categoryIcons[category.key];
              const active = category.key === activeCategory;

              return (
                <li key={category.key}>
                  <Link
                    href={catalogHref(`/tienda/${category.slug}`, query)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-xs px-2 py-1.5 text-[13px] transition-colors duration-fast",
                      active
                        ? "bg-accent/10 text-foreground ring-1 ring-inset ring-accent/30"
                        : "text-muted hover:bg-surface/70 hover:text-foreground",
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 shrink-0",
                        active ? "text-accent" : "text-faint",
                      )}
                    />
                    <span className="flex-1 truncate">
                      {nav(`categories.${category.key}`)}
                    </span>
                    <span className="font-mono text-[10px] text-faint">
                      {category.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Group>
      ) : null}

      <Group title={t("brand")}>
        <ul className="space-y-1.5">
          {brands.map(({ brand, count }) => {
            const checked = query.brands.includes(brand);

            return (
              <li key={brand}>
                <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-[13px] text-muted transition-colors duration-fast hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBrand(brand)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-4 shrink-0 items-center justify-center rounded-xs border border-line-strong bg-surface/60 transition-colors peer-checked:border-accent peer-checked:bg-accent/15 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50"
                  >
                    {checked ? (
                      <Check className="size-3 text-accent" />
                    ) : null}
                  </span>
                  <span className="flex-1 truncate">{brand}</span>
                  <span className="font-mono text-[10px] text-faint">
                    {count}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title={t("availability")}>
        <button
          type="button"
          role="switch"
          aria-checked={query.inStock}
          onClick={() => update({ inStock: !query.inStock })}
          className="flex w-full items-center justify-between gap-3 text-[13px] text-muted transition-colors duration-fast hover:text-foreground"
        >
          <span>{t("inStockOnly")}</span>
          <span
            aria-hidden="true"
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-base",
              query.inStock
                ? "border-accent/60 bg-accent/25"
                : "border-line-strong bg-surface-2",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-3.5 rounded-full transition-transform duration-base",
                query.inStock
                  ? "translate-x-[19px] bg-accent"
                  : "translate-x-0.5 bg-faint",
              )}
            />
          </span>
        </button>
      </Group>

      <Group title={t("price")}>
        <ul className="space-y-1.5">
          {PRICE_OPTIONS.map((bucket) => {
            const checked = query.price === bucket;

            return (
              <li key={bucket}>
                <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-[13px] text-muted transition-colors duration-fast hover:text-foreground">
                  <input
                    type="radio"
                    name={`price-${instance}`}
                    checked={checked}
                    onChange={() => update({ price: bucket })}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-4 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface/60 transition-colors peer-checked:border-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50"
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        checked ? "bg-accent" : "bg-transparent",
                      )}
                    />
                  </span>
                  <span>{t(PRICE_LABEL_KEYS[bucket])}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Group>

      {hasFilters ? (
        <button
          type="button"
          onClick={() =>
            update({ q: "", brands: [], inStock: false, price: "all" })
          }
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-start px-2 text-xs text-muted",
          )}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          {t("clearFilters")}
        </button>
      ) : null}
    </div>
  );
}
