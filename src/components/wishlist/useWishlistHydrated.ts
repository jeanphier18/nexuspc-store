"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/lib/wishlist";

/** True once the persisted wishlist has been read from localStorage. */
export function useWishlistHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useWishlistStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    return useWishlistStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
