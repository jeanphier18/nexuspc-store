import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DealCountdown } from "@/components/home/DealCountdown";
import { ProductCard } from "@/components/product/ProductCard";
import { buttonVariants } from "@/components/ui/Button";
import { getDiscountedProducts } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { discountPercent } from "@/lib/format";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });

  return {
    title: t("dealsPage.title"),
    description: t("dealsPage.body"),
    alternates: alternatesFor(locale, "/ofertas"),
  };
}

export default async function DealsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("catalog");

  const deals = getDiscountedProducts()
    .filter((product) => product.stock !== "out")
    .sort(
      (a, b) =>
        (discountPercent(b.priceCents, b.compareAtCents) ?? 0) -
        (discountPercent(a.priceCents, a.compareAtCents) ?? 0),
    );

  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <header className="flex flex-col gap-8 border-b border-line/70 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">{t("dealsPage.kicker")}</p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            {t("dealsPage.title")}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {t("dealsPage.body")}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <DealCountdown />
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            {t("dealsPage.count", { count: deals.length })}
          </p>
        </div>
      </header>

      {deals.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {deals.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-card border border-line bg-surface/40 px-6 py-16 text-center">
          <p className="font-display text-lg">{t("dealsPage.empty")}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {t("dealsPage.emptyHint")}
          </p>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/tienda"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t("dealsPage.cta")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </main>
  );
}
