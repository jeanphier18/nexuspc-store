"use client";

import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { useCartHydrated } from "@/components/cart/useCartHydrated";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getProduct } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { MAX_QTY, selectCount, selectSubtotalCents, useCartStore } from "@/lib/cart";
import { FREE_SHIPPING_CENTS, missingForFreeShipping } from "@/lib/checkout";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const t = useTranslations("cart");
  const navT = useTranslations("nav");
  const productT = useTranslations("product");
  const locale = useLocale();
  const hydrated = useCartHydrated();

  const items = useCartStore((state) => state.items);
  const count = useCartStore(selectCount);
  const subtotal = useCartStore(selectSubtotalCents);
  const setQty = useCartStore((state) => state.setQty);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);

  const lines = items.flatMap((item) => {
    const product = getProduct(item.slug);
    return product ? [{ ...item, product }] : [];
  });

  const isEmpty = hydrated && lines.length === 0;
  const remaining = missingForFreeShipping(subtotal);
  const progress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_CENTS) * 100),
  );

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">{navT("cart")}</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            {t("pageTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {t("pageBody")}
          </p>
        </div>

        <Link
          href="/tienda"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
        >
          {t("continueShopping")}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </header>

      {!hydrated ? (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="p-6">
            <div className="h-36 animate-pulse rounded-sm bg-surface-2/60" />
          </Card>
          <Card className="p-6">
            <div className="h-52 animate-pulse rounded-sm bg-surface-2/60" />
          </Card>
        </div>
      ) : isEmpty ? (
        <Card className="mt-8 flex flex-col items-center px-6 py-16 text-center">
          <span className="relative flex size-16 items-center justify-center rounded-full border border-line bg-surface-2/60">
            <ShoppingCart aria-hidden="true" className="size-6 text-faint" />
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-pulse-soft rounded-full border border-accent/25"
            />
          </span>
          <h2 className="mt-5 font-display text-xl">{t("empty")}</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {t("emptyHint")}
          </p>
          <Link
            href="/tienda"
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "mt-6",
            )}
          >
            {t("emptyCta")}
          </Link>
        </Card>
      ) : (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <Card className="p-0">
              <ul className="divide-y divide-line">
                {lines.map(({ product, qty }) => {
                  const maxQty = Math.min(
                    MAX_QTY,
                    product.unitsLeft ?? MAX_QTY,
                  );

                  return (
                    <li
                      key={product.slug}
                      className="flex gap-4 p-4 sm:p-5"
                    >
                      <Link
                        href={`/producto/${product.slug}`}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="tech-grid relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-surface-2/50 transition-colors hover:border-line-strong"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0"
                          style={{
                            background:
                              "radial-gradient(70px circle at 50% 115%, rgba(124,58,237,0.35), transparent 70%)",
                          }}
                        />
                        <span className="relative px-1 text-center font-mono text-[8px] uppercase leading-tight tracking-[0.14em] text-foreground/35">
                          {product.brand}
                        </span>
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/producto/${product.slug}`}
                              className="block truncate font-display text-sm leading-snug text-foreground transition-colors hover:text-accent"
                            >
                              {product.name}
                            </Link>
                            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                              {navT(`categories.${product.category}`)}
                            </p>
                            {product.stock !== "in" ? (
                              <Badge
                                variant={
                                  product.stock === "low" ? "danger" : "neutral"
                                }
                                className="mt-2"
                              >
                                {product.stock === "low" && product.unitsLeft
                                  ? productT("lowStock", {
                                      count: product.unitsLeft,
                                    })
                                  : t(`stock.${product.stock}`)}
                              </Badge>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(product.slug)}
                            aria-label={t("removeLabel", { name: product.name })}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-faint transition-colors duration-fast hover:bg-danger/10 hover:text-danger"
                          >
                            <X aria-hidden="true" className="size-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                          <div className="flex items-center rounded-sm border border-line bg-surface/60">
                            <button
                              type="button"
                              aria-label={t("decrease")}
                              onClick={() => setQty(product.slug, qty - 1)}
                              className="flex size-8 items-center justify-center text-muted transition-colors duration-fast hover:text-foreground"
                            >
                              <Minus aria-hidden="true" className="size-3.5" />
                            </button>
                            <span
                              aria-live="polite"
                              className="w-8 text-center font-mono text-xs tabular-nums"
                            >
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label={t("increase")}
                              disabled={qty >= maxQty}
                              onClick={() => setQty(product.slug, qty + 1)}
                              className="flex size-8 items-center justify-center text-muted transition-colors duration-fast hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Plus aria-hidden="true" className="size-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-mono text-sm tabular-nums text-accent">
                              {formatPrice(product.priceCents * qty, locale)}
                            </p>
                            {qty > 1 ? (
                              <p className="mt-0.5 font-mono text-[10px] tabular-nums text-faint">
                                {t("unitPrice", {
                                  price: formatPrice(
                                    product.priceCents,
                                    locale,
                                  ),
                                })}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <div className="mt-4 rounded-md border border-line bg-surface/50 p-4">
              <div className="flex items-center gap-3">
                <Truck
                  aria-hidden="true"
                  className="size-4 shrink-0 text-accent"
                />
                <p
                  aria-live="polite"
                  className="flex-1 text-[11px] leading-relaxed text-muted"
                >
                  {remaining > 0 ? (
                    t("freeShippingProgress", {
                      amount: formatPrice(remaining, locale),
                    })
                  ) : (
                    <span className="text-success">
                      {t("freeShippingUnlocked")}
                    </span>
                  )}
                </p>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500",
                    remaining > 0 ? "bg-accent" : "bg-success",
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <Card className="p-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  {t("summary")}
                </p>
                <p aria-live="polite" className="text-xs text-muted">
                  {t("items", { count })}
                </p>
              </div>

              <div className="mt-5">
                <OrderTotals subtotalCents={subtotal} />
              </div>

              <Link
                href="/checkout"
                className={cn(
                  buttonVariants({ variant: "primary", size: "md" }),
                  "mt-6 w-full",
                )}
              >
                {t("checkout")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                {t("checkoutNote")}
              </p>

              <ul className="mt-5 space-y-2 border-t border-line pt-4 text-[11px] text-muted">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-accent"
                  />
                  {t("secureNote")}
                </li>
              </ul>

              <button
                type="button"
                onClick={clear}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "mt-4 w-full",
                )}
              >
                {t("clear")}
              </button>

              <p className="mt-4 text-[10px] leading-relaxed text-faint">
                {t("demoNote")}
              </p>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
