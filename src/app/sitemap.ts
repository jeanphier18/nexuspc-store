import type { MetadataRoute } from "next";
import { categories } from "@/config/nav";
import { products } from "@/data/catalog";
import { guides } from "@/data/guides";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

type Entry = { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" };

const entries: Entry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/tienda", priority: 0.9, changeFrequency: "daily" },
  { path: "/ofertas", priority: 0.8, changeFrequency: "daily" },
  { path: "/guias", priority: 0.7, changeFrequency: "weekly" },
  { path: "/soporte", priority: 0.6, changeFrequency: "monthly" },
  { path: "/comparar", priority: 0.5, changeFrequency: "monthly" },
  { path: "/cuenta", priority: 0.3, changeFrequency: "monthly" },
  ...categories.map((category) => ({
    path: `/tienda/${category.slug}`,
    priority: 0.7,
    changeFrequency: "weekly" as const,
  })),
  ...products.map((product) => ({
    path: `/producto/${product.slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  })),
  ...guides.map((guide) => ({
    path: `/guias/${guide.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return entries.flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${entry.path}`,
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: {
          es: `${SITE_URL}/es${entry.path}`,
          en: `${SITE_URL}/en${entry.path}`,
        },
      },
    })),
  );
}
