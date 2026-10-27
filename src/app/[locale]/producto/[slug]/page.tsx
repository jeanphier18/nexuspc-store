import { ArrowRight, Check, Scale } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BackgroundArt } from "@/components/layout/BackgroundArt";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductMedia } from "@/components/product/ProductMedia";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { Stars } from "@/components/product/Stars";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { categories } from "@/config/nav";
import { COMPAT_KEYS } from "@/config/product-compat";
import {
  getProduct,
  getRelatedProducts,
  type ProductSpec,
} from "@/data/catalog";
import { getProductImage, getProductImages } from "@/data/product-images";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);

  if (!product) return {};

  const navT = await getTranslations({ locale, namespace: "nav" });
  const specT = await getTranslations({ locale, namespace: "specs" });

  const summary = product.specs
    .slice(0, 3)
    .map((spec) => `${specT(spec.key)}: ${spec.value}`)
    .join(" · ");
  const description = `${product.brand} · ${navT(
    `categories.${product.category}`,
  )}. ${summary}`;
  const image = getProductImage(product);
  const url = `${SITE_URL}/${locale}/producto/${product.slug}`;
  const ogImage = `${SITE_URL}${image.og}`;

  return {
    title: product.name,
    description,
    alternates: alternatesFor(locale, `/producto/${product.slug}`),
    openGraph: {
      type: "website",
      title: `${product.name} — ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${product.name} — ${product.brand}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

function ratingDistribution(rating: number) {
  const five = Math.min(95, Math.max(45, Math.round((rating - 3.5) * 100)));
  const four = Math.round((100 - five) * 0.55);
  const three = Math.round((100 - five - four) * 0.55);
  const two = Math.round((100 - five - four - three) * 0.5);
  const one = 100 - five - four - three - two;

  return [five, four, three, two, one].map((percent, index) => ({
    stars: 5 - index,
    percent,
  }));
}

function compatibilitySpecs(
  specs: ProductSpec[],
  keys: ProductSpec["key"][],
): ProductSpec[] {
  const picked = keys
    .map((key) => specs.find((spec) => spec.key === key))
    .filter((spec): spec is ProductSpec => Boolean(spec));

  for (const spec of specs) {
    if (picked.length >= 3) break;
    if (!picked.includes(spec)) picked.push(spec);
  }

  return picked.slice(0, 3);
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProduct(slug);
  if (!product) notFound();

  const category = categories.find((item) => item.key === product.category);
  if (!category) notFound();

  const t = await getTranslations("product");
  const catalogT = await getTranslations("catalog");
  const navT = await getTranslations("nav");
  const specT = await getTranslations("specs");
  const compareT = await getTranslations("compare");

  const categoryLabel = navT(`categories.${product.category}`);
  const related = getRelatedProducts(product, 4);
  const compat = compatibilitySpecs(product.specs, COMPAT_KEYS[product.category]);
  const distribution = ratingDistribution(product.rating);
  const productImages = getProductImages(product);
  const productUrl = `${SITE_URL}/${locale}/producto/${product.slug}`;
  const availability =
    product.stock === "out"
      ? "https://schema.org/OutOfStock"
      : product.stock === "low"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        image: productImages.map((image) => `${SITE_URL}${image.src}`),
        description: `${product.name} de ${product.brand}. ${product.specs
          .slice(0, 3)
          .map((spec) => `${specT(spec.key)}: ${spec.value}`)
          .join(". ")}.`,
        sku: product.slug,
        category: categoryLabel,
        brand: { "@type": "Brand", name: product.brand },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews,
          bestRating: 5,
          worstRating: 1,
        },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "USD",
          price: (product.priceCents / 100).toFixed(2),
          availability,
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: SITE_NAME },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: navT("home"),
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: navT("shop"),
            item: `${SITE_URL}/${locale}/tienda`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryLabel,
            item: `${SITE_URL}/${locale}/tienda/${category.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="relative isolate mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8 sm:pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BackgroundArt
        items={[
          {
            id: `product-${product.slug}`,
            src: productImages[1]?.src ?? productImages[0].src,
            label: `${product.brand}`,
            side: "right",
            top: "3%",
            depth: 0.9,
            width: "clamp(170px, 12vw, 210px)",
          },
        ]}
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
          href="/tienda"
          className="transition-colors duration-fast hover:text-foreground"
        >
          {navT("shop")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/tienda/${category.slug}`}
          className="transition-colors duration-fast hover:text-foreground"
        >
          {categoryLabel}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="max-w-full truncate text-muted">{product.name}</span>
      </nav>

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          <ProductMedia product={product} />

          <dl className="mt-4 grid grid-cols-3 gap-3">
            {product.specs.slice(0, 3).map((spec) => (
              <div
                key={spec.key}
                className="rounded-sm border border-line bg-surface/50 p-3"
              >
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {specT(spec.key)}
                </dt>
                <dd className="mt-1.5 text-[12px] leading-snug text-foreground/90">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ProductPurchase
          slug={product.slug}
          name={product.name}
          brand={product.brand}
          categoryLabel={categoryLabel}
          categorySlug={category.slug}
          priceCents={product.priceCents}
          compareAtCents={product.compareAtCents}
          rating={product.rating}
          reviews={product.reviews}
          stock={product.stock}
          unitsLeft={product.unitsLeft}
          locale={locale}
        />
      </div>

      {/* ------------------------------------------------------- Specifications */}
      <section
        aria-labelledby="specs-title"
        className="mt-14 border-t border-line/70 pt-10 sm:mt-20"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="eyebrow">{categoryLabel}</p>
            <h2
              id="specs-title"
              className="mt-3 font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
            >
              {t("specsTitle")}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              {catalogT(`categoryBody.${product.category}`)}
            </p>
            <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-faint">
              {t("specsNote")}
            </p>
            <Link
              href={`/comparar?p=${product.slug}`}
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
            >
              <Scale aria-hidden="true" className="size-3.5" />
              {compareT("cta")}
            </Link>
          </div>

          <dl className="grid gap-x-10 sm:grid-cols-2">
            {product.specs.map((spec) => (
              <div
                key={spec.key}
                className="flex items-baseline justify-between gap-4 border-b border-line/60 py-3"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  {specT(spec.key)}
                </dt>
                <dd className="text-right text-[13px] text-foreground/90">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* -------------------------------------------------------- Compatibility */}
      <section
        aria-labelledby="compat-title"
        className="mt-14 border-t border-line/70 pt-10 sm:mt-20"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{categoryLabel}</p>
            <h2
              id="compat-title"
              className="mt-3 font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
            >
              {t("compatibilityTitle")}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            {t("compatibilityBody")}
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {compat.map((spec) => (
            <div
              key={spec.key}
              className="rounded-md border border-line bg-surface/50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  {specT(spec.key)}
                </span>
                <Check aria-hidden="true" className="size-3.5 text-accent" />
              </div>
              <p className="mt-2 font-display text-[15px] font-medium leading-snug text-foreground">
                {spec.value}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                {t.has(`compatHints.${spec.key}`)
                  ? t(`compatHints.${spec.key}`)
                  : t("compatHints.generic")}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
          {t("compatibilityNote")}
        </p>
      </section>

      {/* -------------------------------------------------------------- Reviews */}
      <section
        id="valoraciones"
        aria-labelledby="reviews-title"
        className="mt-14 scroll-mt-24 border-t border-line/70 pt-10 sm:mt-20"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{product.brand}</p>
            <h2
              id="reviews-title"
              className="mt-3 font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
            >
              {t("reviewsTitle")}
            </h2>
          </div>
        </div>

        <Card className="mt-6 grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
          <div className="flex flex-col items-center gap-2 border-line sm:border-r sm:pr-8">
            <span className="font-display text-5xl font-semibold leading-none tracking-[-0.03em] text-foreground">
              {product.rating.toFixed(1)}
            </span>
            <Stars rating={product.rating} />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              {t("reviewsCount", { count: product.reviews })}
            </span>
          </div>

          <dl className="space-y-2">
            {distribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <dt className="w-7 shrink-0 font-mono text-[10px] tabular-nums text-faint">
                  {row.stars}★
                </dt>
                <dd className="flex flex-1 items-center gap-3">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <span
                      className="block h-full rounded-full bg-accent"
                      style={{ width: `${row.percent}%` }}
                    />
                  </span>
                  <span className="w-9 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted">
                    {row.percent}%
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
          {t("reviewsNote")}
        </p>
      </section>

      {/* -------------------------------------------------------------- Related */}
      <section className="mt-14 border-t border-line/70 pt-10 sm:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
            {t("relatedTitle")}
          </h2>
          <Link
            href={`/tienda/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
          >
            {t("relatedCta", { category: categoryLabel })}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        <Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} locale={locale} />
            ))}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
