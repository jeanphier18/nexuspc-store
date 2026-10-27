import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GuideCard } from "@/components/guides/GuideCard";
import { BackgroundArt } from "@/components/layout/BackgroundArt";
import { buttonVariants } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getFeaturedGuide, guides } from "@/data/guides";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guides" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/guias"),
  };
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("guides");
  const featured = getFeaturedGuide();
  const rest = guides.filter((guide) => guide.slug !== featured.slug);

  return (
    <main className="relative isolate mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <BackgroundArt
        items={[
          {
            id: "guides-ssd",
            src: "/products/ssd-sn850-a.webp",
            label: "STORAGE",
            side: "right",
            top: "4%",
            depth: 0.7,
            width: "clamp(180px, 13vw, 220px)",
          },
          {
            id: "guides-ram",
            src: "/products/ram-dominator-a.webp",
            label: "DDR5",
            side: "left",
            top: "62%",
            depth: 1.3,
            width: "clamp(170px, 12vw, 210px)",
          },
        ]}
      />
      <header className="max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          {t("kicker")}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          {t("intro")}
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          {t("count", { count: guides.length })}
        </p>
      </header>

      <GuideCard guide={featured} locale={locale} featured />

      <Reveal>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} locale={locale} />
          ))}
        </div>
      </Reveal>

      <section className="mt-12 flex flex-col gap-5 rounded-card border border-line bg-surface/30 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-display text-xl leading-snug tracking-[-0.01em]">
            {t("ctaTitle")}
          </h2>
          <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-muted">
            {t("ctaBody")}
          </p>
        </div>
        <Link
          href="/comparar"
          className={buttonVariants({ variant: "accent", size: "md" })}
        >
          {t("ctaButton")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </section>
    </main>
  );
}
