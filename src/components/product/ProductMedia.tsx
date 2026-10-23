import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { categoryIcons } from "@/config/category-icons";
import type { Product } from "@/data/catalog";
import { discountPercent } from "@/lib/format";

export async function ProductMedia({ product }: { product: Product }) {
  const t = await getTranslations("product");
  const nav = await getTranslations("nav");
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const Icon = categoryIcons[product.category];

  return (
    <Card className="relative overflow-hidden p-0">
      <div className="tech-grid relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden bg-surface-2/30 sm:aspect-[16/10]">
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 45%, rgba(124,58,237,0.30), transparent 70%), radial-gradient(30% 30% at 80% 85%, rgba(0,229,255,0.14), transparent 70%)",
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-accent/12 via-accent/5 to-transparent"
        />

        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {product.isNew ? (
            <Badge variant="primary" className="backdrop-blur-sm">
              {t("new")}
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

        <span className="relative mb-6 flex size-11 items-center justify-center rounded-md border border-line-strong/70 bg-surface/60 text-accent">
          <Icon aria-hidden="true" className="size-5" />
        </span>

        <span className="relative px-6 text-center font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold uppercase leading-none tracking-[0.14em] text-foreground/25">
          {product.brand}
        </span>
        <span className="relative mt-4 font-mono text-[10px] uppercase tracking-[0.26em] text-faint">
          {nav(`categories.${product.category}`)}
        </span>

        <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-faint/80">
          {t("concept")}
        </span>
      </div>
    </Card>
  );
}
