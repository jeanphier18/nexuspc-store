export type NavItem = {
  key: "shop" | "deals" | "guides" | "support";
  href: string;
};

export const mainNav: NavItem[] = [
  { key: "shop", href: "/tienda" },
  { key: "deals", href: "/ofertas" },
  { key: "guides", href: "/guias" },
  { key: "support", href: "/soporte" },
];

export type CategoryKey =
  | "gpu"
  | "cpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "cases"
  | "monitors"
  | "peripherals"
  | "cooling";

export type NavCategory = {
  key: CategoryKey;
  slug: string;
};

export const categories: NavCategory[] = [
  { key: "gpu", slug: "tarjetas-graficas" },
  { key: "cpu", slug: "procesadores" },
  { key: "motherboard", slug: "motherboards" },
  { key: "ram", slug: "memoria-ram" },
  { key: "storage", slug: "almacenamiento" },
  { key: "psu", slug: "fuentes" },
  { key: "cases", slug: "gabinetes" },
  { key: "monitors", slug: "monitores" },
  { key: "peripherals", slug: "perifericos" },
  { key: "cooling", slug: "refrigeracion" },
];

export const footerLinks = {
  shop: [
    { key: "all", href: "/tienda" },
    { key: "deals", href: "/ofertas" },
    { key: "compare", href: "/comparar" },
  ],
  learn: [
    { key: "guides", href: "/guias" },
    { key: "builds", href: "/guias" },
  ],
  support: [
    { key: "contact", href: "/soporte" },
    { key: "shipping", href: "/soporte" },
    { key: "returns", href: "/soporte" },
    { key: "warranty", href: "/soporte" },
  ],
  company: [
    { key: "about", href: "/soporte" },
    { key: "account", href: "/cuenta" },
  ],
} as const;
