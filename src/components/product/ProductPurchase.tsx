"use client";

import { Check, CreditCard, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Stars } from "@/components/product/Stars";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { StockStatus } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { MAX_QTY, useCartStore } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { discountPercent, formatPrice } from "@/lib/format";

export function ProductPurchase({
  slug,
  name,
  brand,
  categoryLabel,
  categorySlug,
  priceCents,
  compareAtCents,
  rating,
  reviews,
  stock,
  unitsLeft,
  locale,
}: {
  slug: string;
  name: string;
  brand: string;
  categoryLabel: string;
  categorySlug: string;
  priceCents: number;
  compareAtCents?: number;
  rating: number;
  reviews: number;
  stock: StockStatus;
  unitsLeft?: number;
  locale: string;
}) {
  const t = useTranslations("product");
  const cartT = useTranslations("cart");
  const add = useCartStore((state) => state.add);

  const outOfStock = stock === "out";
  const maxQty = outOfStock ? 1 : Math.min(MAX_QTY, unitsLeft ?? MAX_QTY);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  const discount = discountPercent(priceCents, compareAtCents);

  const stockLabel =
    stock === "low" && unitsLeft
      ? t("lowStock", { count: unitsLeft })
      : cartT(`stock.${stock}`);

  const handleAdd = () => {
    if (outOfStock) return;
    add(slug, qty);
    setAdded(true);

    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setAdded(false), 1800);
  };

  const changeQty = (next: number) => {
    setQty(Math.min(Math.max(next, 1), maxQty));
    setAdded(false);
  };

  return (
    <div className="lg:sticky lg:top-24">
      <Card glow className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            {brand}
          </span>
          <Link
            href={`/tienda/${categorySlug}`}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-secondary"
          >
            {categoryLabel}
          </Link>
        </div>

        <h1 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground">
          {name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <Stars rating={rating} />
          <span className="font-mono text-[11px] tabular-nums text-faint">
            {rating.toFixed(1)}
          </span>
          <a
            href="#valoraciones"
            className="font-mono text-[11px] text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {t("reviewsCount", { count: reviews })}
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-[1.75rem] leading-none tabular-nums text-accent">
            {formatPrice(priceCents, locale)}
          </span>
          {compareAtCents ? (
            <span className="font-mono text-sm tabular-nums text-faint line-through">
              {formatPrice(compareAtCents, locale)}
            </span>
          ) : null}
          {discount ? <Badge variant="danger">−{discount}%</Badge> : null}
        </div>
        {compareAtCents ? (
          <p className="mt-1.5 font-mono text-[11px] text-success">
            {t("savings", {
              amount: formatPrice(compareAtCents - priceCents, locale),
            })}
          </p>
        ) : null}

        <p className="mt-4 flex items-center gap-2 text-[13px] text-muted">
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full",
              stock === "in" && "bg-success",
              stock === "low" && "bg-danger",
              outOfStock && "bg-faint",
            )}
          />
          <span className={cn(outOfStock ? "text-faint" : "text-foreground/80")}>
            {stockLabel}
          </span>
        </p>

        <div className="mt-5 flex items-stretch gap-3">
          {outOfStock ? null : (
            <div className="flex h-13 shrink-0 items-center rounded-sm border border-line bg-surface/60">
              <button
                type="button"
                onClick={() => changeQty(qty - 1)}
                disabled={qty <= 1}
                aria-label={cartT("decrease")}
                className="flex h-full w-10 items-center justify-center rounded-l-sm text-muted transition-colors hover:text-foreground disabled:opacity-30"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <span
                aria-live="polite"
                className="w-9 text-center font-mono text-sm tabular-nums text-foreground"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => changeQty(qty + 1)}
                disabled={qty >= maxQty}
                aria-label={cartT("increase")}
                className="flex h-full w-10 items-center justify-center rounded-r-sm text-muted transition-colors hover:text-foreground disabled:opacity-30"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}

          <Button
            type="button"
            size="lg"
            variant={outOfStock ? "outline" : added ? "accent" : "primary"}
            disabled={outOfStock}
            onClick={handleAdd}
            aria-live="polite"
            className="h-13 flex-1 px-4"
          >
            {added ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                {cartT("added")}
              </>
            ) : outOfStock ? (
              cartT("outOfStock")
            ) : (
              <>
                <ShoppingCart aria-hidden="true" className="size-4" />
                <span className="truncate">
                  {cartT("add")} · {formatPrice(priceCents * qty, locale)}
                </span>
              </>
            )}
          </Button>
        </div>

        <div className="mt-3">
          <WishlistButton slug={slug} variant="text" />
        </div>

        <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[11px] text-muted">
          <li className="flex items-center gap-2.5">
            <Truck aria-hidden="true" className="size-3.5 shrink-0 text-accent" />
            {t("trust.shipping")}
          </li>
          <li className="flex items-center gap-2.5">
            <ShieldCheck
              aria-hidden="true"
              className="size-3.5 shrink-0 text-accent"
            />
            {t("trust.warranty")}
          </li>
          <li className="flex items-center gap-2.5">
            <CreditCard
              aria-hidden="true"
              className="size-3.5 shrink-0 text-accent"
            />
            {t("trust.payment")}
          </li>
        </ul>
      </Card>
    </div>
  );
}
