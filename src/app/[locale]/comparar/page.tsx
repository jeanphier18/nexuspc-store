import { Scale } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CompareItem } from "@/components/compare/ComparePicker";
import { ComparePicker } from "@/components/compare/ComparePicker";
import { CompareTable } from "@/components/compare/CompareTable";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { products as catalog, type Product } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { compareHref, resolveCompareProducts } from "@/lib/compare";
import { alternatesFor } from "@/lib/metadata";

type SearchParams = Record<string, string | string[] | undefined>;

const PRESETS = [
  {
    key: "presetGpu",
    slugs: ["nvidia-rtx-5090", "nvidia-rtx-5080", "amd-radeon-rx-9070-xt"],
  },
  {
    key: "presetCpu",
    slugs: [
      "amd-ryzen-7-9800x3d",
      "amd-ryzen-9-9950x3d",
      "intel-core-ultra-9-285k",
    ],
  },
  {
    key: "presetSsd",
    slugs: ["samsung-990-pro-2tb", "wd-black-sn850x-2tb", "crucial-t705-2tb"],
  },
] as const;

function toItem(product: Product): CompareItem {
  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    priceCents: product.priceCents,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/comparar"),
  };
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const selected = resolveCompareProducts(query.p);
  const t = await getTranslations("compare");

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t("intro")}</p>
      </header>

      <ComparePicker
        selected={selected.map(toItem)}
        options={catalog.map(toItem)}
      />

      {selected.length >= 2 ? (
        <CompareTable products={selected} locale={locale} />
      ) : (
        <Card className="mt-9 flex flex-col items-center px-6 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-line bg-surface-2/60">
            <Scale aria-hidden="true" className="size-6 text-accent/70" />
          </span>

          <h2 className="mt-5 font-display text-xl font-medium">
            {selected.length === 0 ? t("emptyTitle") : t("needTwo")}
          </h2>

          {selected.length === 0 ? (
            <>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                {t("emptyBody")}
              </p>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {t("presetsTitle")}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {PRESETS.map((preset) => (
                  <Link
                    key={preset.key}
                    href={compareHref([...preset.slugs])}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    {t(preset.key)}
                  </Link>
                ))}
              </div>

              <Link
                href="/tienda"
                className={cn(
                  buttonVariants({ variant: "primary", size: "md" }),
                  "mt-6",
                )}
              >
                {t("browse")}
              </Link>
            </>
          ) : null}
        </Card>
      )}
    </main>
  );
}
