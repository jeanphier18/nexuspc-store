"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct } from "@/data/catalog";

export const MAX_QTY = 10;

export type CartItem = {
  slug: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (slug, qty = 1) => {
        const product = getProduct(slug);
        if (!product || product.stock === "out" || qty <= 0) return;

        set((state) => {
          const existing = state.items.find((item) => item.slug === slug);

          if (!existing) {
            return {
              items: [
                ...state.items,
                { slug, qty: Math.min(Math.round(qty), MAX_QTY) },
              ],
            };
          }

          return {
            items: state.items.map((item) =>
              item.slug === slug
                ? { ...item, qty: Math.min(item.qty + qty, MAX_QTY) }
                : item,
            ),
          };
        });
      },
      remove: (slug) =>
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        })),
      setQty: (slug, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((item) => item.slug !== slug) };
          }

          return {
            items: state.items.map((item) =>
              item.slug === slug
                ? { ...item, qty: Math.min(Math.round(qty), MAX_QTY) }
                : item,
            ),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "nexus-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // The server has no access to localStorage. Hydrating in an effect
      // keeps the first client render identical to the server markup.
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => {
        const raw = (persisted as { items?: unknown } | undefined)?.items;

        if (!Array.isArray(raw)) {
          return { ...current, items: [] };
        }

        const items = raw
          .filter((item): item is CartItem => {
            if (typeof item !== "object" || item === null) return false;
            const candidate = item as Partial<CartItem>;
            const product =
              typeof candidate.slug === "string"
                ? getProduct(candidate.slug)
                : undefined;

            return (
              Boolean(product) &&
              product?.stock !== "out" &&
              typeof candidate.qty === "number" &&
              Number.isFinite(candidate.qty) &&
              candidate.qty > 0
            );
          })
          .map((item) => ({
            slug: item.slug,
            qty: Math.min(Math.max(Math.round(item.qty), 1), MAX_QTY),
          }));

        return { ...current, items };
      },
    },
  ),
);

export const selectCount = (state: CartState): number =>
  state.items.reduce((total, item) => total + item.qty, 0);

export const selectSubtotalCents = (state: CartState): number =>
  state.items.reduce((total, item) => {
    const product = getProduct(item.slug);
    return total + (product ? product.priceCents * item.qty : 0);
  }, 0);
