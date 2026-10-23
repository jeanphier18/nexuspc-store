import type { ShippingMethod } from "@/lib/checkout";

export type OrderLine = {
  slug: string;
  name: string;
  brand: string;
  qty: number;
  priceCents: number;
};

export type OrderAddress = {
  line: string;
  city: string;
  postal: string;
  country: string;
};

export type Order = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  method: ShippingMethod;
  items: OrderLine[];
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  address?: OrderAddress;
};

export const ORDERS_KEY = "nexus-orders";
export const LAST_ORDER_KEY = "nexus-last-order";
const MAX_STORED_ORDERS = 20;

function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Partial<Order>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.total === "number" &&
    (candidate.method === "standard" || candidate.method === "express") &&
    Array.isArray(candidate.items)
  );
}

/**
 * Orders live only in this browser. New orders are written to an array;
 * the single-order key is kept as a fallback for older sessions.
 */
export function readOrders(): Order[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;

    if (Array.isArray(parsed)) {
      return parsed.filter(isOrder).slice(0, MAX_STORED_ORDERS);
    }
  } catch {
    // Ignore malformed storage and fall through to the legacy key.
  }

  try {
    const raw = window.localStorage.getItem(LAST_ORDER_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;

    if (isOrder(parsed)) return [parsed];
  } catch {
    // Ignore malformed storage.
  }

  return [];
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;

  try {
    const previous = readOrders();
    const next = [order, ...previous.filter((item) => item.id !== order.id)]
      .slice(0, MAX_STORED_ORDERS);

    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Storage can be unavailable (private mode); the confirmation still works.
  }
}

export function clearOrders(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(ORDERS_KEY);
    window.localStorage.removeItem(LAST_ORDER_KEY);
  } catch {
    // Nothing to clean up.
  }
}
