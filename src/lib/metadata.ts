import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Canonical URL plus hreflang alternates for a localized route.
 * `path` is the locale-less path, e.g. "/tienda" or `/producto/${slug}`.
 */
export function alternatesFor(
  locale: string,
  path = "",
): Metadata["alternates"] {
  const suffix =
    path === "" || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;

  return {
    canonical: `${SITE_URL}/${locale}${suffix}`,
    languages: {
      es: `${SITE_URL}/es${suffix}`,
      en: `${SITE_URL}/en${suffix}`,
      "x-default": `${SITE_URL}/es${suffix}`,
    },
  };
}
