import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AccountView } from "@/components/account/AccountView";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/cuenta"),
  };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <AccountView />
    </main>
  );
}
