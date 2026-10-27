import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Unbounded } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CartHydrator } from "@/components/cart/CartHydrator";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollBackground } from "@/components/layout/ScrollBackground";
import { WishlistHydrator } from "@/components/wishlist/WishlistHydrator";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteTitle = `${t("siteName")} — ${t("tagline")}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s · ${t("siteName")}`,
    },
    description: t("description"),
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: siteTitle,
      description: t("description"),
      locale: locale === "en" ? "en_US" : "es_MX",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: t("description"),
      images: ["/og.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const navT = await getTranslations({ locale, namespace: "nav" });

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${unbounded.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen overflow-x-clip bg-background text-foreground antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-on-accent"
        >
          {navT("skip")}
        </a>
        <ScrollBackground />
        <NextIntlClientProvider>
          <CartHydrator />
          <WishlistHydrator />
          <div className="relative z-10 flex min-h-svh flex-col">
            <Header />
            <div id="content" tabIndex={-1} className="flex-1 pt-16 focus:outline-none">
              {children}
            </div>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
