"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/lib/wishlist";

/** Rehydrates the wishlist after mount to keep SSR and client in sync. */
export function WishlistHydrator() {
  useEffect(() => {
    void useWishlistStore.persist.rehydrate();
  }, []);

  return null;
}
