import type { CategoryKey } from "@/config/nav";
import type { SpecKey } from "@/data/catalog";

/**
 * Specs shown in the "Before you buy" block of a product page.
 * Keys are ordered by relevance; missing ones fall back to the next.
 */
export const COMPAT_KEYS: Record<CategoryKey, SpecKey[]> = {
  gpu: ["gpuLength", "tdp", "interface"],
  cpu: ["socket", "tdp", "cores"],
  motherboard: ["socket", "formFactor", "memory"],
  ram: ["memory", "speed", "capacity"],
  storage: ["interface", "capacity", "formFactor"],
  psu: ["wattage", "efficiency", "modular"],
  cases: ["gpuLength", "moboSupport", "formFactor"],
  monitors: ["resolution", "refresh", "panel"],
  peripherals: ["connection", "type", "weight"],
  cooling: ["type", "size", "noise"],
};
