export type ShippingMethod = "standard" | "express";

/** Orders at or above this subtotal ship free with the standard method. */
export const FREE_SHIPPING_CENTS = 50000;

export const SHIPPING_CENTS: Record<ShippingMethod, number> = {
  standard: 1990,
  express: 2990,
};

/** Flat demo tax rate applied to the subtotal. */
export const TAX_RATE = 0.08;

export function shippingCents(
  subtotalCents: number,
  method: ShippingMethod = "standard",
): number {
  if (subtotalCents <= 0) return 0;
  if (method === "standard" && subtotalCents >= FREE_SHIPPING_CENTS) return 0;
  return SHIPPING_CENTS[method];
}

export function computeTotals(
  subtotalCents: number,
  method: ShippingMethod = "standard",
): {
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
} {
  const shipping = shippingCents(subtotalCents, method);
  const taxes = Math.round(subtotalCents * TAX_RATE);

  return {
    subtotal: subtotalCents,
    shipping,
    taxes,
    total: subtotalCents + shipping + taxes,
  };
}

export function missingForFreeShipping(subtotalCents: number): number {
  return Math.max(FREE_SHIPPING_CENTS - subtotalCents, 0);
}

export function createOrderId(): string {
  const random = Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()
    .padEnd(6, "0");

  return `NX-${random}`;
}
