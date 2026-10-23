import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DealCountdown } from "@/components/home/DealCountdown";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { ProductCard } from "@/components/product/ProductCard";
import { Stars } from "@/components/product/Stars";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
  getDiscountedProducts,
  getFeaturedProducts,
  getProduct,
} from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: { absolute: `${t("siteName")} — ${t("tagline")}` },
    description: t("description"),
    alternates: alternatesFor(locale),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const cartT = await getTranslations("cart");
  const footerT = await getTranslations("footer");

  const heroProduct = getProduct("nvidia-rtx-5090");
  const featured = getFeaturedProducts();
  const deals = getDiscountedProducts()
    .filter(
      (product) =>
        product.stock !== "out" &&
        !featured.some((item) => item.slug === product.slug),
    )
    .slice(0, 3);

  const trust = [
    { key: "shipping", label: t("hero.microShipping"), Icon: Truck },
    { key: "warranty", label: t("hero.microWarranty"), Icon: ShieldCheck },
    { key: "secure", label: footerT("trust.secure"), Icon: CreditCard },
    { key: "support", label: t("hero.microSupport"), Icon: Sparkles },
  ];

  const guides = ["gpu", "ram", "build"] as const;
  const reviews = ["one", "two", "three"] as const;

  return (
    <main>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
        <div className="grid gap-10 xl:grid-cols-[1.3fr_0.7fr] xl:items-center xl:gap-14">
          <div>
            <Badge variant="accent">{t("hero.eyebrow")}</Badge>

            <h1 className="mt-6 font-display text-[clamp(2.5rem,5.4vw,3.9rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              <span className="block">{t("hero.title")}</span>{" "}
              <span className="block text-accent glow-accent">
                {t("hero.titleAccent")}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tienda"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "w-full justify-center sm:w-auto",
                )}
              >
                {t("hero.primaryCta")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/ofertas"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full justify-center sm:w-auto",
                )}
              >
                {t("hero.secondaryCta")}
              </Link>
            </div>
          </div>

          {heroProduct ? (
            <div className="relative mx-auto w-full max-w-md xl:mx-0 xl:max-w-none">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 -z-10 rounded-[3rem] bg-primary/20 blur-3xl"
              />
              <Card glow className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    {t("hero.featuredLabel")}
                  </span>
                  <Badge
                    variant={heroProduct.stock === "low" ? "danger" : "success"}
                  >
                    {cartT(`stock.${heroProduct.stock}`)}
                  </Badge>
                </div>

                <div className="relative mt-4 flex h-44 flex-col items-center justify-center overflow-hidden rounded-md border border-line/70 bg-surface-2/50">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(300px circle at 50% 130%, rgba(0,229,255,0.22), transparent 70%), radial-gradient(280px circle at 15% 0%, rgba(124,58,237,0.28), transparent 70%)",
                    }}
                  />
                  <p className="relative font-display text-3xl tracking-tight text-foreground/85">
                    {heroProduct.specs[0]?.value}
                  </p>
                  <p className="relative mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                    {heroProduct.brand}
                  </p>
                </div>

                <h2 className="mt-4 font-display text-xl leading-snug">
                  <Link
                    href={`/producto/${heroProduct.slug}`}
                    className="transition-colors duration-fast hover:text-accent"
                  >
                    {heroProduct.name}
                  </Link>
                </h2>
                <p className="mt-1 font-mono text-[11px] text-faint">
                  {heroProduct.specs
                    .slice(1, 3)
                    .map((spec) => spec.value)
                    .join(" · ")}
                </p>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <span className="font-mono text-base tabular-nums text-accent">
                    {formatPrice(heroProduct.priceCents, locale)}
                  </span>
                  <AddToCartButton slug={heroProduct.slug} />
                </div>

                <Link
                  href={`/producto/${heroProduct.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
                >
                  {t("hero.featuredCta")}
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </Card>
            </div>
          ) : null}
        </div>
      </section>

      {/* --------------------------------------------------------- Trust strip */}
      <div className="border-y border-line/70 bg-surface/40 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:px-8">
          {trust.map(({ key, label, Icon }) => (
            <span
              key={key}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted"
            >
              <Icon aria-hidden="true" className="size-4 text-accent" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------ Categories */}
      <Section
        kicker={t("categories.kicker")}
        title={t("categories.title")}
        body={t("categories.body")}
      >
        <CategoryGrid />
      </Section>

      {/* -------------------------------------------------------------- Featured */}
      <Section
        kicker={t("featured.kicker")}
        title={t("featured.title")}
        body={t("featured.body")}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
          >
            {t("featured.cta")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- Deals */}
      <Section
        kicker={t("deals.kicker")}
        title={t("deals.title")}
        body={t("deals.body")}
        aside={<DealCountdown />}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/ofertas"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
          >
            {t("deals.cta")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- Guides */}
      <Section
        kicker={t("guides.kicker")}
        title={t("guides.title")}
        body={t("guides.body")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {guides.map((key) => (
            <Link
              key={key}
              href="/guias"
              className="group flex flex-col rounded-card border border-line bg-surface/60 p-6 backdrop-blur-sm transition-colors duration-base hover:border-line-strong"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  {t(`guides.items.${key}.tag`)}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-faint transition-colors duration-base group-hover:text-accent"
                />
              </div>
              <h3 className="mt-6 font-display text-lg leading-tight">
                {t(`guides.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`guides.items.${key}.description`)}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/guias"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
          >
            {t("guides.cta")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </Section>

      {/* --------------------------------------------------------------- Reviews */}
      <Section
        kicker={t("reviews.kicker")}
        title={t("reviews.title")}
        body={t("reviews.body")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {reviews.map((key) => (
            <Card key={key} className="flex flex-col p-6">
              <Stars rating={5} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                “{t(`reviews.items.${key}.quote`)}”
              </blockquote>
              <div className="mt-6 border-t border-line pt-4">
                <p className="font-display text-sm">
                  {t(`reviews.items.${key}.name`)}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  {t(`reviews.items.${key}.role`)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ Newsletter */}
      <section className="border-t border-line/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-card border border-primary/30 bg-primary/10 p-7 sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(560px circle at 85% 0%, rgba(0,229,255,0.16), transparent 65%)",
              }}
            />
            <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <p className="eyebrow">{t("newsletter.kicker")}</p>
                <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  {t("newsletter.title")}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                  {t("newsletter.body")}
                </p>
              </div>

              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
