"use client";

import { ChevronDown, Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import type { CategoryKey } from "@/config/nav";
import { categories } from "@/config/nav";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { compareHref, MAX_COMPARE } from "@/lib/compare";
import { formatPrice } from "@/lib/format";

export type CompareItem = {
  slug: string;
  name: string;
  brand: string;
  category: CategoryKey;
  priceCents: number;
};

export function ComparePicker({
  selected,
  options,
}: {
  selected: CompareItem[];
  options: CompareItem[];
}) {
  const t = useTranslations("compare");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const chosen = new Set(selected.map((item) => item.slug));
  const available = options.filter((item) => !chosen.has(item.slug));

  const go = (slugs: string[]) => {
    startTransition(() => {
      router.replace(compareHref(slugs), { scroll: false });
    });
  };

  const add = (slug: string) => {
    if (!slug) return;
    go([...selected.map((item) => item.slug), slug]);
  };

  const remove = (slug: string) => {
    go(selected.map((item) => item.slug).filter((item) => item !== slug));
  };

  return (
    <div aria-busy={pending}>
      <div
        className={cn(
          "mt-8 grid grid-cols-2 gap-2 transition-opacity sm:gap-3 xl:grid-cols-4",
          pending && "opacity-60",
        )}
      >
        {Array.from({ length: MAX_COMPARE }, (_, index) => {
          const slot = selected[index];

          if (!slot) {
            return (
              <div
                key={`slot-${index}`}
                className="rounded-md border border-dashed border-line bg-surface/20 p-4"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  {t("slot", { number: index + 1 })}
                </p>
                <div className="relative mt-3">
                  <select
                    value=""
                    disabled={pending}
                    onChange={(event) => add(event.target.value)}
                    aria-label={t("addPlaceholder")}
                    className="h-9 w-full appearance-none rounded-sm border border-line bg-surface/70 px-3 pr-8 text-xs text-muted transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:cursor-not-allowed"
                  >
                    <option value="">{t("addPlaceholder")}</option>
                    {categories.map((category) => {
                      const group = available.filter(
                        (item) => item.category === category.key,
                      );

                      if (group.length === 0) return null;

                      return (
                        <optgroup
                          key={category.key}
                          label={navT(`categories.${category.key}`)}
                        >
                          {group.map((item) => (
                            <option key={item.slug} value={item.slug}>
                              {item.name} — {item.brand}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint"
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={slot.slug}
              className="rounded-md border border-line bg-surface/50 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  {navT(`categories.${slot.category}`)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(slot.slug)}
                  aria-label={t("remove", { name: slot.name })}
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </div>

              <Link
                href={`/producto/${slot.slug}`}
                className="mt-2 block font-display text-sm leading-snug transition-colors hover:text-accent line-clamp-2"
              >
                {slot.name}
              </Link>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                {slot.brand}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="font-mono text-xs tabular-nums text-accent">
                  {formatPrice(slot.priceCents, locale)}
                </span>
                <Link
                  href={`/producto/${slot.slug}`}
                  className="text-[10px] text-muted transition-colors hover:text-foreground"
                >
                  {t("viewProduct")} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex min-h-5 items-center justify-between gap-3">
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={() => go([])}
            className="inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-foreground"
          >
            {t("clear")}
          </button>
        ) : (
          <span />
        )}
        {pending ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
            <Loader2 aria-hidden="true" className="size-3 animate-spin" />
            {t("addPlaceholder")}
          </span>
        ) : null}
      </div>
    </div>
  );
}
