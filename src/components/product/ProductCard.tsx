import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Stars } from "@/components/product/Stars";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Product } from "@/data/catalog";
import { getProductImage } from "@/data/product-images";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { discountPercent, formatCount, formatPrice } from "@/lib/format";

export async function ProductCard({
  product,
  locale,
  className,
}: {
  product: Product;
  locale: string;
  className?: string;
}) {
  const t = await getTranslations("cart");
  const specT = await getTranslations("specs");
  const nav = await getTranslations("nav");
  const productT = await getTranslations("product");

  const stock = {
    in: { label: t("stock.in"), variant: "success" as const },
    low: { label: t("stock.low"), variant: "danger" as const },
    out: { label: t("stock.out"), variant: "neutral" as const },
  }[product.stock];

  const stockLabel =
    product.stock === "low" && product.unitsLeft
      ? productT("lowStock", { count: product.unitsLeft })
      : stock.label;

  const discount = discountPercent(
    product.priceCents,
    product.compareAtCents,
  );
  const image = getProductImage(product);
  const href = `/producto/${product.slug}`;
  const meta = product.specs
    .slice(0, 2)
    .map((spec) => `${specT(spec.key).toUpperCase()} ${spec.value}`)
    .join(" · ");

  return (
    <Card glow className={cn("flex flex-col p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          {nav(`categories.${product.category}`)}
        </span>
        <Badge variant={stock.variant} className="shrink-0">
          {stockLabel}
        </Badge>
      </div>

      <div className="relative mt-4">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="block overflow-hidden rounded-md border border-line/70 bg-surface-2/50 transition-colors duration-fast hover:border-line-strong"
        >
          <span className="relative block aspect-[4/3] w-full overflow-hidden">
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-slow group-hover:scale-[1.045]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/5"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 shadow-[inset_0_0_50px_rgba(7,7,13,0.28)]"
            />
          </span>
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {product.isNew ? (
            <Badge variant="primary" className="backdrop-blur-sm">
              {productT("new")}
            </Badge>
          ) : (
            <span />
          )}
          {discount ? (
            <Badge variant="danger" className="backdrop-blur-sm">
              −{discount}%
            </Badge>
          ) : null}
        </div>

        <WishlistButton slug={product.slug} variant="overlay" />
      </div>

      <h3 className="mt-4 font-display text-base leading-snug">
        <Link
          href={href}
          className="transition-colors duration-fast hover:text-accent"
        >
          {product.name}
        </Link>
      </h3>

      <p className="mt-1 font-mono text-[11px] text-faint">{meta}</p>

      <div className="mt-2 flex items-center gap-2">
        <Stars rating={product.rating} />
        <span className="font-mono text-[10px] text-faint">
          {product.rating.toFixed(1)} · {formatCount(product.reviews, locale)}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-mono text-sm tabular-nums text-accent">
            {formatPrice(product.priceCents, locale)}
          </span>
          {product.compareAtCents ? (
            <span className="font-mono text-[11px] tabular-nums text-faint line-through">
              {formatPrice(product.compareAtCents, locale)}
            </span>
          ) : null}
        </div>

        <AddToCartButton
          slug={product.slug}
          outOfStock={product.stock === "out"}
        />
      </div>
    </Card>
  );
}
