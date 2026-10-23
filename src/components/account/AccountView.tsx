"use client";

import {
  ChevronDown,
  Heart,
  MapPin,
  Package,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { useWishlistHydrated } from "@/components/wishlist/useWishlistHydrated";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getProduct } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { regionName } from "@/lib/countries";
import { formatMonthYear, formatPrice, formatShortDate } from "@/lib/format";
import { clearOrders, readOrders, type Order } from "@/lib/orders";
import { useWishlistStore } from "@/lib/wishlist";

function OrderCard({ order, locale }: { order: Order; locale: string }) {
  const t = useTranslations("account");
  const placed = new Date(order.createdAt);
  const delivery = new Date(
    placed.getTime() + (order.method === "express" ? 2 : 5) * 86_400_000,
  );
  const count = order.items.reduce((total, item) => total + item.qty, 0);

  return (
    <li>
      <details className="group rounded-md border border-line bg-surface/50 transition-colors open:border-line-strong">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-line bg-surface-2/60">
            <Package aria-hidden="true" className="size-4 text-accent" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
              {order.id}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-faint">
              {formatShortDate(placed, locale)} ·{" "}
              {t("orders.items", { count })}
            </p>
          </div>

          <Badge variant="success">{t("orders.statusConfirmed")}</Badge>
          <span className="font-mono text-sm tabular-nums text-accent">
            {formatPrice(order.total, locale)}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-faint transition-transform duration-fast group-open:rotate-180"
          />
        </summary>

        <div className="border-t border-line/70 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
            {t("orders.delivery", {
              date: formatShortDate(delivery, locale),
            })}
          </p>

          <ul className="mt-3 divide-y divide-line/60">
            {order.items.map((item) => (
              <li
                key={`${order.id}-${item.slug}`}
                className="flex items-start justify-between gap-3 py-2 text-xs"
              >
                <span className="min-w-0">
                  <span className="font-mono text-faint">{item.qty}× </span>
                  <Link
                    href={`/producto/${item.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {item.name}
                  </Link>
                </span>
                <span className="shrink-0 font-mono tabular-nums text-muted">
                  {formatPrice(item.priceCents * item.qty, locale)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <OrderTotals
              subtotalCents={order.subtotal}
              method={order.method}
            />
          </div>

          {order.address ? (
            <div className="mt-4 border-t border-line/60 pt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                {t("orders.shipTo")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {order.name} · {order.address.line}, {order.address.postal}{" "}
                {order.address.city}, {regionName(locale, order.address.country)}
              </p>
            </div>
          ) : null}
        </div>
      </details>
    </li>
  );
}

export function AccountView() {
  const t = useTranslations("account");
  const locale = useLocale();

  const wishlistReady = useWishlistHydrated();
  const wishlist = useWishlistStore((state) => state.slugs);
  const removeWish = useWishlistStore((state) => state.remove);
  const clearWishlist = useWishlistStore((state) => state.clear);

  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    setOrders(readOrders());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!confirming) return;

    const timer = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const latest = orders[0];
  const oldest = orders[orders.length - 1];
  const name = latest?.name?.trim() || t("profile.guest");
  const email = latest?.email?.trim() || t("profile.guestEmail");
  const initials =
    latest?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "NX";

  const wishlistProducts = wishlist.flatMap((slug) => {
    const product = getProduct(slug);
    return product ? [product] : [];
  });

  const hasData = orders.length > 0 || wishlist.length > 0;

  const handleClear = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    clearOrders();
    clearWishlist();
    setOrders([]);
    setConfirming(false);
    setCleared(true);
    window.setTimeout(() => setCleared(false), 2500);
  };

  return (
    <div>
      <header className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            {t("title")}
          </h1>
          <Badge variant="accent">{t("demoBadge")}</Badge>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t("intro")}</p>
      </header>

      <Card className="mt-8 flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-display text-lg text-accent">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight">
              {mounted ? name : t("profile.guest")}
            </p>
            <p className="mt-1 break-words text-sm text-muted">
              {mounted ? email : "—"}
            </p>
            {mounted && oldest ? (
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                {t("profile.memberSince", {
                  date: formatMonthYear(new Date(oldest.createdAt), locale),
                })}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-56">
          <div className="rounded-sm border border-line bg-surface/50 p-3 text-center">
            <p className="font-display text-xl leading-none">
              {mounted ? orders.length : "—"}
            </p>
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              {t("profile.orders")}
            </p>
          </div>
          <div className="rounded-sm border border-line bg-surface/50 p-3 text-center">
            <p className="font-display text-xl leading-none">
              {wishlistReady ? wishlist.length : "—"}
            </p>
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              {t("profile.wishlist")}
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="orders-title">
          <div className="flex items-baseline justify-between gap-3">
            <h2
              id="orders-title"
              className="font-display text-xl font-medium"
            >
              {t("orders.title")}
            </h2>
            {mounted && orders.length > 0 ? (
              <span className="font-mono text-[10px] text-faint">
                {orders.length}
              </span>
            ) : null}
          </div>

          {!mounted ? (
            <Card className="mt-4 p-5">
              <div className="h-16 animate-pulse rounded-sm bg-surface-2/60" />
            </Card>
          ) : orders.length === 0 ? (
            <Card className="mt-4 flex flex-col items-start gap-4 border-dashed p-6">
              <span className="flex size-11 items-center justify-center rounded-full border border-line bg-surface-2/60">
                <ShoppingBag aria-hidden="true" className="size-5 text-faint" />
              </span>
              <div>
                <p className="font-display text-base">{t("orders.empty")}</p>
                <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
                  {t("orders.emptyBody")}
                </p>
              </div>
              <Link
                href="/tienda"
                className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
              >
                {t("orders.cta")}
              </Link>
            </Card>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} locale={locale} />
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 text-accent" />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {t("address.title")}
              </p>
            </div>

            {mounted && latest?.address ? (
              <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-muted">
                <p className="text-foreground">{latest.name}</p>
                <p>{latest.address.line}</p>
                <p>
                  {latest.address.postal} · {latest.address.city}
                </p>
                <p>{regionName(locale, latest.address.country)}</p>
              </address>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {mounted ? t("address.empty") : "—"}
              </p>
            )}
          </Card>

          <Card className="p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              {t("data.title")}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              {t("data.body")}
            </p>

            <Button
              type="button"
              variant={confirming ? "danger" : "outline"}
              size="sm"
              onClick={handleClear}
              disabled={!mounted || !hasData}
              className="mt-4 w-full"
            >
              <Trash2 aria-hidden="true" className="size-3.5" />
              {confirming ? t("data.confirm") : t("data.clear")}
            </Button>

            {cleared ? (
              <p role="status" className="mt-2 text-[10px] text-success">
                {t("data.cleared")}
              </p>
            ) : null}
          </Card>
        </aside>
      </div>

      <section
        aria-labelledby="wishlist-title"
        className="mt-12 border-t border-line/70 pt-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="wishlist-title"
              className="font-display text-xl font-medium"
            >
              {t("wishlist.title")}
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              {t("wishlist.count", {
                count: wishlistReady ? wishlist.length : 0,
              })}
            </p>
          </div>

          {wishlistReady && wishlistProducts.length > 0 ? (
            <Link
              href="/tienda"
              className="text-xs font-medium text-accent transition-colors hover:text-foreground"
            >
              {t("wishlist.emptyCta")} →
            </Link>
          ) : null}
        </div>

        {!wishlistReady ? (
          <div className="mt-4 h-24 animate-pulse rounded-md bg-surface-2/60" />
        ) : wishlistProducts.length === 0 ? (
          <Card className="mt-4 flex flex-col items-center border-dashed px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full border border-line bg-surface-2/60">
              <Heart aria-hidden="true" className="size-5 text-faint" />
            </span>
            <p className="mt-4 font-display text-base">{t("wishlist.empty")}</p>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
              {t("wishlist.emptyBody")}
            </p>
            <Link
              href="/tienda"
              className={cn(
                buttonVariants({ variant: "primary", size: "sm" }),
                "mt-5",
              )}
            >
              {t("wishlist.emptyCta")}
            </Link>
          </Card>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {wishlistProducts.map((product) => (
              <li
                key={product.slug}
                className="rounded-md border border-line bg-surface/50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/producto/${product.slug}`}
                      className="block truncate font-display text-sm leading-snug transition-colors hover:text-accent"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                      {product.brand}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWish(product.slug)}
                    aria-label={t("wishlist.remove", { name: product.name })}
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-accent transition-colors hover:bg-danger/10 hover:text-danger"
                  >
                    <Heart aria-hidden="true" className="size-4 fill-current" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs tabular-nums text-accent">
                    {formatPrice(product.priceCents, locale)}
                  </span>
                  <AddToCartButton
                    slug={product.slug}
                    outOfStock={product.stock === "out"}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
