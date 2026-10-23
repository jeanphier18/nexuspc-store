"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct } from "@/data/catalog";

export const MAX_WISHLIST = 30;

type WishlistState = {
  slugs: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) =>
        set((state) => {
          if (state.slugs.includes(slug)) {
            return { slugs: state.slugs.filter((item) => item !== slug) };
          }

          if (!getProduct(slug) || state.slugs.length >= MAX_WISHLIST) {
            return state;
          }

          return { slugs: [slug, ...state.slugs] };
        }),
      remove: (slug) =>
        set((state) => ({
          slugs: state.slugs.filter((item) => item !== slug),
        })),
      clear: () => set({ slugs: [] }),
    }),
    {
      name: "nexus-wishlist",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ slugs: state.slugs }),
      merge: (persisted, current) => {
        const raw = (persisted as { slugs?: unknown } | undefined)?.slugs;

        if (!Array.isArray(raw)) {
          return { ...current, slugs: [] };
        }

        const slugs = raw.filter(
          (slug): slug is string =>
            typeof slug === "string" && Boolean(getProduct(slug)),
        );

        return {
          ...current,
          slugs: Array.from(new Set(slugs)).slice(0, MAX_WISHLIST),
        };
      },
    },
  ),
);

export const selectWishlistCount = (state: WishlistState): number =>
  state.slugs.length;
