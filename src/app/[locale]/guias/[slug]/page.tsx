import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GuideCard } from "@/components/guides/GuideCard";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { categoryIcons } from "@/config/category-icons";
import { getProduct } from "@/data/catalog";
import { getGuide, getRelatedGuides, guides, type Guide } from "@/data/guides";
import { Link } from "@/i18n/navigation";
import { compareHref } from "@/lib/compare";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/format";
import { alternatesFor } from "@/lib/metadata";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

function copyFor(guide: Guide, locale: string) {
  return guide.copy[locale === "en" ? "en" : "es"];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  const t = await getTranslations({ locale, namespace: "guides" });

  if (!guide) {
    return { title: t("title") };
  }

  const copy = copyFor(guide, locale);

  return {
    title: copy.title,
    description: copy.excerpt,
    alternates: alternatesFor(locale, `/guias/${guide.slug}`),
    openGraph: {
      type: "article",
      title: copy.title,
      description: copy.excerpt,
      publishedTime: guide.date,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getGuide(slug);
  if (!guide) {
    notFound();
  }

  const t = await getTranslations("guides");
  const navT = await getTranslations("nav");
  const copy = copyFor(guide, locale);
  const Icon = categoryIcons[guide.category];
  const related = getRelatedGuides(guide, 2);
  const recommended = guide.products
    .map((productSlug) => getProduct(productSlug))
    .filter((product) => product !== undefined);
  const href = compareHref(guide.products);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.title,
    description: copy.excerpt,
    datePublished: guide.date,
    inLanguage: locale,
    author: { "@type": "Organization", name: "NEXUS PC" },
    publisher: { "@type": "Organization", name: "NEXUS PC" },
  };

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint"
      >
        <Link
          href="/"
          className="transition-colors duration-fast hover:text-foreground"
        >
          {navT("home")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/guias"
          className="transition-colors duration-fast hover:text-foreground"
        >
          {t("title")}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="max-w-[18rem] truncate text-muted sm:max-w-[32rem]">
          {copy.title}
        </span>
      </nav>

      <header className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            <Icon aria-hidden="true" className="size-3" />
            {navT(`categories.${guide.category}`)}
          </span>
          <Badge variant="neutral">{t(`level.${guide.level}`)}</Badge>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            {t("readTime", { minutes: guide.readMinutes })}
          </span>
          <span aria-hidden="true" className="text-faint">
            ·
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            {formatShortDate(new Date(guide.date), locale)}
          </span>
        </div>

        <h1 className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          {copy.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {copy.excerpt}
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="max-w-3xl">
          <p className="text-[15px] leading-relaxed text-foreground/85">
            {copy.intro}
          </p>

          {copy.sections.map((section, index) => (
            <section
              key={section.heading}
              id={`s-${index + 1}`}
              className="mt-10 scroll-mt-24"
            >
              <h2 className="font-display text-xl leading-snug tracking-[-0.015em] sm:text-2xl">
                {section.heading}
              </h2>
              {section.body ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {section.body}
                </p>
              ) : null}
              {section.list ? (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.55rem] size-1.5 shrink-0 rotate-45 bg-accent/70"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.note ? (
                <p className="mt-4 border-l-2 border-accent/60 bg-accent/[0.05] px-4 py-3 text-xs leading-relaxed text-muted">
                  {section.note}
                </p>
              ) : null}
            </section>
          ))}

          <div className="mt-12 rounded-card border border-accent/30 bg-accent/[0.06] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {t("takeaway")}
            </p>
            <p className="mt-2 font-display text-lg leading-snug tracking-[-0.01em]">
              {copy.takeaway}
            </p>
          </div>

          <Link
            href="/guias"
            className="mt-8 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {t("back")}
          </Link>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <nav aria-label={t("toc")}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                {t("toc")}
              </p>
              <ol className="mt-3 space-y-1">
                {copy.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#s-${index + 1}`}
                      className="block border-l border-line py-1 pl-3 text-xs leading-snug text-muted transition-colors duration-fast hover:border-accent hover:text-foreground"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <Link
              href={href}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full",
              )}
            >
              <Scale aria-hidden="true" className="size-3.5" />
              {t("compareThem")}
            </Link>
          </div>
        </aside>
      </div>

      {recommended.length > 0 ? (
        <section className="mt-16 border-t border-line/70 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl leading-tight tracking-[-0.02em]">
              {t("products")}
            </h2>
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
            >
              <Scale aria-hidden="true" className="size-3.5" />
              {t("compareThem")}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommended.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-14 border-t border-line/70 pt-8">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl leading-tight tracking-[-0.02em]">
              {t("related")}
            </h2>
            <Link
              href="/guias"
              className="inline-flex items-center gap-1 text-xs text-accent transition-colors hover:text-foreground"
            >
              {t("back")}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <GuideCard
                key={item.slug}
                guide={item}
                locale={locale}
                headingLevel="h3"
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
