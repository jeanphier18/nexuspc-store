import type { CategoryKey } from "@/config/nav";

export type StockStatus = "in" | "low" | "out";

export type SpecKey =
  | "vram"
  | "tdp"
  | "interface"
  | "boost"
  | "cores"
  | "threads"
  | "socket"
  | "chipset"
  | "formFactor"
  | "memory"
  | "capacity"
  | "speed"
  | "latency"
  | "read"
  | "write"
  | "wattage"
  | "efficiency"
  | "modular"
  | "panel"
  | "resolution"
  | "refresh"
  | "response"
  | "size"
  | "connection"
  | "type"
  | "noise"
  | "rpm"
  | "gpuLength"
  | "moboSupport"
  | "ports"
  | "battery"
  | "weight";

export type ProductSpec = {
  key: SpecKey;
  value: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: CategoryKey;
  priceCents: number;
  compareAtCents?: number;
  stock: StockStatus;
  unitsLeft?: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  specs: ProductSpec[];
};

export const products: Product[] = [
  // ---------------------------------------------------------------- GPUs (4)
  {
    slug: "nvidia-rtx-5090",
    name: "GeForce RTX 5090",
    brand: "NVIDIA",
    category: "gpu",
    priceCents: 249900,
    stock: "low",
    unitsLeft: 2,
    rating: 4.9,
    reviews: 312,
    isNew: true,
    specs: [
      { key: "vram", value: "32 GB GDDR7" },
      { key: "tdp", value: "575 W" },
      { key: "interface", value: "PCIe 5.0 x16" },
      { key: "boost", value: "2.41 GHz" },
    ],
  },
  {
    slug: "nvidia-rtx-5080",
    name: "GeForce RTX 5080",
    brand: "NVIDIA",
    category: "gpu",
    priceCents: 129900,
    compareAtCents: 139900,
    stock: "in",
    rating: 4.8,
    reviews: 1204,
    specs: [
      { key: "vram", value: "16 GB GDDR7" },
      { key: "tdp", value: "360 W" },
      { key: "interface", value: "PCIe 5.0 x16" },
      { key: "boost", value: "2.62 GHz" },
    ],
  },
  {
    slug: "amd-radeon-rx-9070-xt",
    name: "Radeon RX 9070 XT",
    brand: "AMD",
    category: "gpu",
    priceCents: 74900,
    stock: "in",
    rating: 4.7,
    reviews: 688,
    specs: [
      { key: "vram", value: "16 GB GDDR6" },
      { key: "tdp", value: "304 W" },
      { key: "interface", value: "PCIe 5.0 x16" },
      { key: "boost", value: "2.97 GHz" },
    ],
  },
  {
    slug: "nvidia-rtx-5070-ti",
    name: "GeForce RTX 5070 Ti",
    brand: "NVIDIA",
    category: "gpu",
    priceCents: 89900,
    stock: "in",
    rating: 4.6,
    reviews: 942,
    specs: [
      { key: "vram", value: "16 GB GDDR7" },
      { key: "tdp", value: "300 W" },
      { key: "interface", value: "PCIe 5.0 x16" },
      { key: "boost", value: "2.45 GHz" },
    ],
  },

  // ---------------------------------------------------------------- CPUs (3)
  {
    slug: "amd-ryzen-9-9950x3d",
    name: "Ryzen 9 9950X3D",
    brand: "AMD",
    category: "cpu",
    priceCents: 69900,
    stock: "in",
    rating: 4.9,
    reviews: 517,
    isNew: true,
    specs: [
      { key: "cores", value: "16" },
      { key: "threads", value: "32" },
      { key: "socket", value: "AM5" },
      { key: "boost", value: "5.7 GHz" },
      { key: "tdp", value: "170 W" },
    ],
  },
  {
    slug: "amd-ryzen-7-9800x3d",
    name: "Ryzen 7 9800X3D",
    brand: "AMD",
    category: "cpu",
    priceCents: 47900,
    stock: "low",
    unitsLeft: 5,
    rating: 4.9,
    reviews: 2108,
    specs: [
      { key: "cores", value: "8" },
      { key: "threads", value: "16" },
      { key: "socket", value: "AM5" },
      { key: "boost", value: "5.2 GHz" },
      { key: "tdp", value: "120 W" },
    ],
  },
  {
    slug: "intel-core-ultra-9-285k",
    name: "Core Ultra 9 285K",
    brand: "Intel",
    category: "cpu",
    priceCents: 58900,
    compareAtCents: 61900,
    stock: "in",
    rating: 4.5,
    reviews: 433,
    specs: [
      { key: "cores", value: "24" },
      { key: "threads", value: "24" },
      { key: "socket", value: "LGA 1851" },
      { key: "boost", value: "5.7 GHz" },
      { key: "tdp", value: "250 W" },
    ],
  },

  // --------------------------------------------------------- Motherboards (3)
  {
    slug: "gigabyte-x870e-aorus-master",
    name: "X870E AORUS Master",
    brand: "GIGABYTE",
    category: "motherboard",
    priceCents: 49900,
    stock: "in",
    rating: 4.7,
    reviews: 189,
    specs: [
      { key: "socket", value: "AM5" },
      { key: "chipset", value: "X870E" },
      { key: "formFactor", value: "ATX" },
      { key: "memory", value: "DDR5 · 8000 MT/s OC" },
    ],
  },
  {
    slug: "msi-mag-b850-tomahawk-wifi",
    name: "MAG B850 Tomahawk WiFi",
    brand: "MSI",
    category: "motherboard",
    priceCents: 22900,
    compareAtCents: 25900,
    stock: "in",
    rating: 4.6,
    reviews: 356,
    specs: [
      { key: "socket", value: "AM5" },
      { key: "chipset", value: "B850" },
      { key: "formFactor", value: "ATX" },
      { key: "memory", value: "DDR5 · 8200 MT/s OC" },
    ],
  },
  {
    slug: "asus-rog-strix-z890-e",
    name: "ROG Strix Z890-E Gaming WiFi",
    brand: "ASUS",
    category: "motherboard",
    priceCents: 44900,
    stock: "in",
    rating: 4.5,
    reviews: 142,
    specs: [
      { key: "socket", value: "LGA 1851" },
      { key: "chipset", value: "Z890" },
      { key: "formFactor", value: "ATX" },
      { key: "memory", value: "DDR5 · 8600 MT/s OC" },
    ],
  },

  // ----------------------------------------------------------------- RAM (3)
  {
    slug: "gskill-trident-z5-neo-32gb",
    name: "Trident Z5 Neo RGB 32 GB",
    brand: "G.Skill",
    category: "ram",
    priceCents: 18900,
    compareAtCents: 21900,
    stock: "out",
    rating: 4.8,
    reviews: 876,
    specs: [
      { key: "capacity", value: "32 GB (2×16)" },
      { key: "speed", value: "6000 MT/s" },
      { key: "latency", value: "CL30" },
      { key: "type", value: "DDR5" },
    ],
  },
  {
    slug: "kingston-fury-beast-32gb",
    name: "Fury Beast 32 GB",
    brand: "Kingston",
    category: "ram",
    priceCents: 11900,
    stock: "in",
    rating: 4.7,
    reviews: 1521,
    specs: [
      { key: "capacity", value: "32 GB (2×16)" },
      { key: "speed", value: "5600 MT/s" },
      { key: "latency", value: "CL36" },
      { key: "type", value: "DDR5" },
    ],
  },
  {
    slug: "corsair-dominator-titanium-64gb",
    name: "Dominator Titanium 64 GB",
    brand: "Corsair",
    category: "ram",
    priceCents: 32900,
    stock: "low",
    unitsLeft: 3,
    rating: 4.6,
    reviews: 214,
    specs: [
      { key: "capacity", value: "64 GB (2×32)" },
      { key: "speed", value: "6400 MT/s" },
      { key: "latency", value: "CL32" },
      { key: "type", value: "DDR5" },
    ],
  },

  // ------------------------------------------------------------- Storage (3)
  {
    slug: "samsung-990-pro-2tb",
    name: "990 PRO 2 TB",
    brand: "Samsung",
    category: "storage",
    priceCents: 18900,
    compareAtCents: 22900,
    stock: "in",
    rating: 4.9,
    reviews: 3402,
    specs: [
      { key: "capacity", value: "2 TB" },
      { key: "interface", value: "PCIe 4.0 x4" },
      { key: "read", value: "7,450 MB/s" },
      { key: "write", value: "6,900 MB/s" },
    ],
  },
  {
    slug: "wd-black-sn850x-2tb",
    name: "Black SN850X 2 TB",
    brand: "WD",
    category: "storage",
    priceCents: 14900,
    stock: "in",
    rating: 4.8,
    reviews: 2877,
    specs: [
      { key: "capacity", value: "2 TB" },
      { key: "interface", value: "PCIe 4.0 x4" },
      { key: "read", value: "7,300 MB/s" },
      { key: "write", value: "6,600 MB/s" },
    ],
  },
  {
    slug: "crucial-t705-2tb",
    name: "T705 2 TB",
    brand: "Crucial",
    category: "storage",
    priceCents: 25900,
    stock: "in",
    rating: 4.7,
    reviews: 398,
    isNew: true,
    specs: [
      { key: "capacity", value: "2 TB" },
      { key: "interface", value: "PCIe 5.0 x4" },
      { key: "read", value: "14,500 MB/s" },
      { key: "write", value: "12,700 MB/s" },
    ],
  },

  // ----------------------------------------------------------------- PSU (2)
  {
    slug: "corsair-rm1000x",
    name: "RM1000x 1000 W",
    brand: "Corsair",
    category: "psu",
    priceCents: 18900,
    stock: "in",
    rating: 4.8,
    reviews: 1640,
    specs: [
      { key: "wattage", value: "1000 W" },
      { key: "efficiency", value: "80+ Gold" },
      { key: "modular", value: "Full" },
      { key: "formFactor", value: "ATX 3.1" },
    ],
  },
  {
    slug: "seasonic-vertex-gx-850",
    name: "Vertex GX-850",
    brand: "Seasonic",
    category: "psu",
    priceCents: 14900,
    stock: "low",
    unitsLeft: 4,
    rating: 4.7,
    reviews: 512,
    specs: [
      { key: "wattage", value: "850 W" },
      { key: "efficiency", value: "80+ Gold" },
      { key: "modular", value: "Full" },
      { key: "formFactor", value: "ATX 3.0" },
    ],
  },

  // --------------------------------------------------------------- Cases (3)
  {
    slug: "lian-li-o11d-evo",
    name: "O11 Dynamic EVO",
    brand: "Lian Li",
    category: "cases",
    priceCents: 14900,
    stock: "in",
    rating: 4.8,
    reviews: 921,
    specs: [
      { key: "formFactor", value: "Mid Tower" },
      { key: "moboSupport", value: "E-ATX / ATX / mATX" },
      { key: "gpuLength", value: "420 mm" },
      { key: "size", value: "465 × 285 × 459 mm" },
    ],
  },
  {
    slug: "fractal-design-north",
    name: "North",
    brand: "Fractal Design",
    category: "cases",
    priceCents: 13900,
    stock: "in",
    rating: 4.7,
    reviews: 640,
    specs: [
      { key: "formFactor", value: "Mid Tower" },
      { key: "moboSupport", value: "ATX / mATX / ITX" },
      { key: "gpuLength", value: "355 mm" },
      { key: "size", value: "447 × 215 × 469 mm" },
    ],
  },
  {
    slug: "nzxt-h7-flow",
    name: "H7 Flow",
    brand: "NZXT",
    category: "cases",
    priceCents: 12900,
    compareAtCents: 14900,
    stock: "out",
    rating: 4.5,
    reviews: 388,
    specs: [
      { key: "formFactor", value: "Mid Tower" },
      { key: "moboSupport", value: "ATX / mATX / ITX" },
      { key: "gpuLength", value: "400 mm" },
      { key: "size", value: "466 × 244 × 468 mm" },
    ],
  },

  // ------------------------------------------------------------ Monitors (2)
  {
    slug: "lg-ultragear-27gr93u",
    name: "UltraGear 27GR93U",
    brand: "LG",
    category: "monitors",
    priceCents: 49900,
    stock: "in",
    rating: 4.7,
    reviews: 428,
    specs: [
      { key: "panel", value: "IPS" },
      { key: "resolution", value: "4K UHD · 3840 × 2160" },
      { key: "refresh", value: "144 Hz" },
      { key: "response", value: "1 ms" },
      { key: "size", value: '27"' },
    ],
  },
  {
    slug: "samsung-odyssey-oled-g9",
    name: "Odyssey OLED G9",
    brand: "Samsung",
    category: "monitors",
    priceCents: 129900,
    stock: "low",
    unitsLeft: 2,
    rating: 4.6,
    reviews: 176,
    isNew: true,
    specs: [
      { key: "panel", value: "QD-OLED" },
      { key: "resolution", value: "DQHD · 5120 × 1440" },
      { key: "refresh", value: "240 Hz" },
      { key: "response", value: "0.03 ms" },
      { key: "size", value: '49"' },
    ],
  },

  // --------------------------------------------------------- Peripherals (3)
  {
    slug: "logitech-g-pro-x-superlight-2",
    name: "G Pro X Superlight 2",
    brand: "Logitech",
    category: "peripherals",
    priceCents: 15900,
    stock: "in",
    rating: 4.8,
    reviews: 1932,
    specs: [
      { key: "type", value: "Mouse" },
      { key: "connection", value: "Wireless 2.4 GHz" },
      { key: "weight", value: "60 g" },
      { key: "battery", value: "95 h" },
    ],
  },
  {
    slug: "keychron-q1-pro",
    name: "Q1 Pro",
    brand: "Keychron",
    category: "peripherals",
    priceCents: 19900,
    stock: "in",
    rating: 4.7,
    reviews: 604,
    specs: [
      { key: "type", value: "Keyboard" },
      { key: "connection", value: "Bluetooth / USB-C" },
      { key: "formFactor", value: "75%" },
      { key: "weight", value: "1.6 kg" },
    ],
  },
  {
    slug: "hyperx-cloud-iii",
    name: "Cloud III",
    brand: "HyperX",
    category: "peripherals",
    priceCents: 9900,
    compareAtCents: 11900,
    stock: "in",
    rating: 4.6,
    reviews: 2510,
    specs: [
      { key: "type", value: "Headset" },
      { key: "connection", value: "USB-C / 3.5 mm" },
      { key: "weight", value: "320 g" },
      { key: "noise", value: "Detachable mic" },
    ],
  },

  // ------------------------------------------------------------ Cooling (2)
  {
    slug: "noctua-nh-d15-g2",
    name: "NH-D15 G2",
    brand: "Noctua",
    category: "cooling",
    priceCents: 14900,
    stock: "in",
    rating: 4.9,
    reviews: 782,
    specs: [
      { key: "type", value: "Air cooler" },
      { key: "size", value: "2× 140 mm" },
      { key: "noise", value: "24.8 dBA" },
      { key: "tdp", value: "250 W" },
    ],
  },
  {
    slug: "nzxt-kraken-elite-360",
    name: "Kraken Elite 360 RGB",
    brand: "NZXT",
    category: "cooling",
    priceCents: 29900,
    stock: "out",
    rating: 4.6,
    reviews: 311,
    specs: [
      { key: "type", value: "AIO 360 mm" },
      { key: "size", value: "3× 120 mm" },
      { key: "noise", value: "30 dBA" },
      { key: "tdp", value: "350 W" },
    ],
  },
];

export const PRODUCT_COUNT = products.length;

export const CATEGORY_COUNT = new Set(products.map((product) => product.category))
  .size;

const productsBySlug = new Map(products.map((product) => [product.slug, product]));

export function getProduct(slug: string): Product | undefined {
  return productsBySlug.get(slug);
}

export function getProductsByCategory(category: CategoryKey): Product[] {
  return products.filter((product) => product.category === category);
}

const FEATURED_SLUGS = [
  "nvidia-rtx-5080",
  "amd-ryzen-7-9800x3d",
  "samsung-990-pro-2tb",
  "lian-li-o11d-evo",
];

export function getFeaturedProducts(): Product[] {
  return FEATURED_SLUGS.map((slug) => getProduct(slug)).filter(
    (product): product is Product => Boolean(product),
  );
}

export function getDiscountedProducts(): Product[] {
  return products.filter((product) => product.compareAtCents);
}

/**
 * Same-category products first (closest price wins), then top-rated
 * in-stock products from other categories to fill the row.
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products
    .filter(
      (candidate) =>
        candidate.category === product.category &&
        candidate.slug !== product.slug,
    )
    .sort(
      (a, b) =>
        Math.abs(a.priceCents - product.priceCents) -
        Math.abs(b.priceCents - product.priceCents),
    );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const inSameCategory = new Set(sameCategory.map((item) => item.slug));
  const fillers = products
    .filter(
      (candidate) =>
        candidate.slug !== product.slug &&
        !inSameCategory.has(candidate.slug) &&
        candidate.stock !== "out",
    )
    .sort((a, b) => b.rating - a.rating);

  return [...sameCategory, ...fillers].slice(0, limit);
}

// Fail the build early instead of shipping an inconsistent catalog.
function assertCatalogIsValid(): void {
  const seenSlugs = new Set<string>();

  for (const product of products) {
    if (seenSlugs.has(product.slug)) {
      throw new Error(`Catalog: duplicate slug "${product.slug}"`);
    }
    seenSlugs.add(product.slug);

    if (!Number.isInteger(product.priceCents) || product.priceCents <= 0) {
      throw new Error(`Catalog: invalid priceCents for "${product.slug}"`);
    }
    if (
      product.compareAtCents !== undefined &&
      product.compareAtCents <= product.priceCents
    ) {
      throw new Error(
        `Catalog: compareAtCents must be higher than priceCents for "${product.slug}"`,
      );
    }
    if (product.specs.length < 3) {
      throw new Error(`Catalog: "${product.slug}" needs at least 3 specs`);
    }
    if (product.stock === "out" && product.unitsLeft !== undefined) {
      throw new Error(`Catalog: "${product.slug}" is out of stock but has units`);
    }
  }
}

assertCatalogIsValid();
