"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart";

/**
 * The persisted cart is rehydrated after mount (see CartHydrator), so
 * routes that depend on it must wait to avoid flashing an empty state.
 */
export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    return useCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
