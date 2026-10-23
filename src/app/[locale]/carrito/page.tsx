import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CartView } from "@/components/cart/CartView";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/data/catalog";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });

  return {
    title: t("pageTitle"),
    alternates: alternatesFor(locale, "/carrito"),
    robots: { index: false, follow: true },
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("cart");
  const suggested = getFeaturedProducts();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <CartView />

      <section className="mt-16 border-t border-line/70 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
              {t("suggestedTitle")}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
              {t("suggestedBody")}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {suggested.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}
