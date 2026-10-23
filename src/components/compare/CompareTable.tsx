import { X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Stars } from "@/components/product/Stars";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { compareHref, SPEC_ORDER } from "@/lib/compare";
import { formatPrice } from "@/lib/format";

export async function CompareTable({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  const t = await getTranslations("compare");
  const cartT = await getTranslations("cart");
  const specT = await getTranslations("specs");
  const navT = await getTranslations("nav");
  const productT = await getTranslations("product");

  const specKeys = SPEC_ORDER.filter((key) =>
    products.some((product) => product.specs.some((spec) => spec.key === key)),
  );

  const lowestPrice = Math.min(...products.map((product) => product.priceCents));

  const valueFor = (product: Product, key: (typeof SPEC_ORDER)[number]) =>
    product.specs.find((spec) => spec.key === key)?.value ?? null;

  const differsAt = (key: (typeof SPEC_ORDER)[number]) =>
    new Set(products.map((product) => valueFor(product, key) ?? "—")).size > 1;

  return (
    <section className="mt-9" aria-label={t("tableLabel")}>
      <p className="mb-2 text-right font-mono text-[9px] uppercase tracking-[0.14em] text-faint sm:hidden">
        {t("swipe")} →
      </p>
      <div className="overflow-x-auto rounded-card border border-line bg-surface/30">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">{t("tableLabel")}</caption>

          <thead>
            <tr className="border-b border-line">
              <th
                scope="col"
                className="sticky left-0 z-10 w-24 border-r border-line/70 bg-surface px-3 py-4 align-bottom font-mono text-[9px] uppercase tracking-[0.16em] text-faint sm:w-40 sm:px-4"
              >
                <span className="sr-only sm:not-sr-only">{t("specs")}</span>
              </th>

              {products.map((product) => {
                const stockLabel =
                  product.stock === "low" && product.unitsLeft
                    ? productT("lowStock", { count: product.unitsLeft })
                    : cartT(`stock.${product.stock}`);

                return (
                  <th
                    key={product.slug}
                    scope="col"
                    className="min-w-[190px] border-r border-line/40 px-4 py-4 align-top font-normal last:border-r-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                        {navT(`categories.${product.category}`)}
                      </span>
                      <Link
                        href={compareHref(
                          products
                            .filter((item) => item.slug !== product.slug)
                            .map((item) => item.slug),
                        )}
                        aria-label={t("remove", { name: product.name })}
                        className="flex size-6 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <X aria-hidden="true" className="size-3.5" />
                      </Link>
                    </div>

                    <Link
                      href={`/producto/${product.slug}`}
                      className="mt-2 block font-display text-[15px] leading-snug transition-colors hover:text-accent"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                      {product.brand}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "font-mono text-sm tabular-nums",
                          product.priceCents === lowestPrice
                            ? "text-accent"
                            : "text-foreground",
                        )}
                      >
                        {formatPrice(product.priceCents, locale)}
                      </span>
                      {product.priceCents === lowestPrice ? (
                        <Badge variant="success">{t("bestPrice")}</Badge>
                      ) : null}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Stars rating={product.rating} />
                      <span className="font-mono text-[10px] text-faint">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>

                    <Badge
                      variant={
                        product.stock === "in"
                          ? "success"
                          : product.stock === "low"
                            ? "danger"
                            : "neutral"
                      }
                      className="mt-2"
                    >
                      {stockLabel}
                    </Badge>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {specKeys.map((key) => {
              const rowDiffers = differsAt(key);

              return (
                <tr
                  key={key}
                  className={cn(
                    "border-b border-line/60 last:border-b-0",
                    rowDiffers && "bg-accent/5",
                  )}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-line/70 bg-surface px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:px-4"
                  >
                    {specT(key)}
                  </th>
                  {products.map((product) => {
                    const value = valueFor(product, key);

                    return (
                      <td
                        key={product.slug}
                        className={cn(
                          "border-r border-line/40 px-4 py-3 text-[13px] last:border-r-0",
                          value
                            ? rowDiffers
                              ? "text-foreground"
                              : "text-muted"
                            : "text-faint/60",
                        )}
                      >
                        {value ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
        {t("differencesNote")}
      </p>
    </section>
  );
}
