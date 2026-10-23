"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart";

export function AddToCartButton({
  slug,
  outOfStock = false,
}: {
  slug: string;
  outOfStock?: boolean;
}) {
  const t = useTranslations("cart");
  const add = useCartStore((state) => state.add);
  const [added, setAdded] = useState(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  const handleClick = () => {
    add(slug);
    setAdded(true);

    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={added ? "accent" : "outline"}
      disabled={outOfStock}
      onClick={handleClick}
      aria-live="polite"
      className="min-w-[96px]"
    >
      {outOfStock ? null : added ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <ShoppingCart aria-hidden="true" className="size-4" />
      )}
      {outOfStock ? t("outOfStock") : added ? t("added") : t("add")}
    </Button>
  );
}
