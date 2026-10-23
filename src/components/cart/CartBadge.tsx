"use client";

import { selectCount, useCartStore } from "@/lib/cart";

export function CartBadge() {
  const count = useCartStore(selectCount);

  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold leading-none text-on-accent">
      {count > 9 ? "9+" : count}
    </span>
  );
}
