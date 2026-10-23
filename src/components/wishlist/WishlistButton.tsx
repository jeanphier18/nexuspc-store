"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWishlistHydrated } from "@/components/wishlist/useWishlistHydrated";
import { cn } from "@/lib/cn";
import { useWishlistStore } from "@/lib/wishlist";

type Variant = "overlay" | "text" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  overlay:
    "absolute bottom-3 right-3 z-10 size-8 rounded-full border border-line-strong/70 bg-background/70 text-muted backdrop-blur hover:border-accent/60 hover:text-accent",
  text: "gap-1.5 text-[11px] text-muted hover:text-accent",
  ghost: "size-8 rounded-full text-muted hover:bg-surface-2 hover:text-danger",
};

export function WishlistButton({
  slug,
  variant = "overlay",
  className,
}: {
  slug: string;
  variant?: Variant;
  className?: string;
}) {
  const t = useTranslations("wishlist");
  const hydrated = useWishlistHydrated();
  const saved = useWishlistStore((state) => state.slugs.includes(slug));
  const toggle = useWishlistStore((state) => state.toggle);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={hydrated ? saved : undefined}
      aria-label={saved ? t("remove") : t("add")}
      title={saved ? t("saved") : t("add")}
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-fast",
        VARIANT_CLASSES[variant],
        saved && variant !== "ghost" && "text-accent",
        saved && variant === "overlay" && "border-accent/60",
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn(variant === "text" ? "size-3.5" : "size-4", saved && "fill-current")}
      />
      {variant === "text" ? (saved ? t("savedShort") : t("addShort")) : null}
    </button>
  );
}
