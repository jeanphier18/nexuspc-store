"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart";

/**
 * Rehydrates the persisted cart after mount so the server HTML and the
 * first client render stay identical (no hydration mismatch on the badge).
 */
export function CartHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
