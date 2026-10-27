import type { Product } from "@/data/catalog";

export type ProductImage = {
  id: string;
  src: string;
  og: string;
  alt: string;
};

/**
 * Cada producto usa dos fotografías cuando existen. Las imágenes son
 * ilustrativas: el detalle exacto del modelo puede variar.
 */
const productImageIds: Record<string, [string, string]> = {
  "nvidia-rtx-5090": ["gpu-5090-a", "gpu-5090-c"],
  "nvidia-rtx-5080": ["gpu-5080-a", "gpu-5080-b"],
  "amd-radeon-rx-9070-xt": ["gpu-9070-a", "gpu-9070-b"],
  "nvidia-rtx-5070-ti": ["gpu-5070ti-a", "gpu-5070ti-b"],

  "amd-ryzen-9-9950x3d": ["cpu-9950-a", "cpu-9950-b"],
  "amd-ryzen-7-9800x3d": ["cpu-9800-a", "cpu-9800-b"],
  "intel-core-ultra-9-285k": ["cpu-285k-a", "cpu-285k-b"],

  "gigabyte-x870e-aorus-master": ["mobo-aorus-a", "mobo-aorus-b"],
  "msi-mag-b850-tomahawk-wifi": ["mobo-msi-a", "mobo-msi-b"],
  "asus-rog-strix-z890-e": ["mobo-asus-a", "mobo-asus-b"],

  "gskill-trident-z5-neo-32gb": ["ram-trident-a", "ram-trident-b"],
  "kingston-fury-beast-32gb": ["ram-fury-a", "ram-fury-b"],
  "corsair-dominator-titanium-64gb": [
    "ram-dominator-a",
    "ram-dominator-b",
  ],

  "samsung-990-pro-2tb": ["ssd-990-a", "ssd-990-b"],
  "wd-black-sn850x-2tb": ["ssd-sn850-a", "ssd-sn850-b"],
  "crucial-t705-2tb": ["ssd-t705-a", "ssd-t705-b"],

  "corsair-rm1000x": ["psu-rm-a", "psu-rm-b"],
  "seasonic-vertex-gx-850": ["psu-vertex-a", "psu-vertex-b"],

  "lian-li-o11d-evo": ["case-o11-b", "case-o11-a"],
  "fractal-design-north": ["case-north-a", "case-north-b"],
  "nzxt-h7-flow": ["case-h7-a", "case-h7-b"],

  "lg-ultragear-27gr93u": ["monitor-lg-a", "monitor-lg-b"],
  "samsung-odyssey-oled-g9": ["monitor-g9-a", "monitor-g9-b"],

  "logitech-g-pro-x-superlight-2": ["mouse-a", "mouse-b"],
  "keychron-q1-pro": ["keyboard-a", "keyboard-b"],
  "hyperx-cloud-iii": ["headset-a", "headset-b"],

  "noctua-nh-d15-g2": ["cooling-air-b", "cooling-air-a"],
  "nzxt-kraken-elite-360": ["cooling-aio-a", "cooling-aio-b"],
};

const fallbackByCategory: Record<Product["category"], string> = {
  gpu: "gpu-5090-a",
  cpu: "cpu-9950-b",
  motherboard: "mobo-aorus-a",
  ram: "ram-trident-b",
  storage: "ssd-sn850-a",
  psu: "psu-rm-a",
  cases: "case-h7-a",
  monitors: "monitor-lg-a",
  peripherals: "keyboard-a",
  cooling: "cooling-air-b",
};

export function getProductImages(product: Product): ProductImage[] {
  const ids =
    productImageIds[product.slug] ??
    ([fallbackByCategory[product.category], fallbackByCategory[product.category]] as [
      string,
      string,
    ]);

  return ids.map((id, index) => ({
    id,
    src: `/products/${id}.webp`,
    og: `/products/${id}-og.jpg`,
    alt:
      index === 0
        ? `${product.name} — ${product.brand}`
        : `${product.name} — ${index + 1}`,
  }));
}

export function getProductImage(product: Product): ProductImage {
  return getProductImages(product)[0];
}
