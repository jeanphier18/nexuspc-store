import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });

  return {
    title: t("title"),
    alternates: alternatesFor(locale, "/checkout"),
    robots: { index: false, follow: true },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <CheckoutFlow />
    </main>
  );
}
