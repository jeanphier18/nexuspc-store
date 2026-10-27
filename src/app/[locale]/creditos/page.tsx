import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { imageCredits } from "@/data/image-credits";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/creditos"),
  };
}

export default async function CreditsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("credits");

  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {t("back")}
        </Link>

        <p className="eyebrow mt-10">{t("eyebrow")}</p>
        <h1 className="mt-3 max-w-3xl font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {t("intro")}
        </p>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-faint">
          {t("body")}
        </p>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          {t("imagesCount", { count: imageCredits.length })}
        </p>

        {imageCredits.length > 0 ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imageCredits.map((credit) => (
              <li key={credit.id}>
                <Card className="flex h-full flex-col p-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                    <Image
                      src={`/products/${credit.id}.webp`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="font-display text-sm leading-snug text-foreground">
                      {credit.title}
                    </p>
                    <p className="mt-2 font-mono text-[10px] leading-relaxed text-faint">
                      {t("creatorLabel")}: {credit.creator || "—"}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
                      {credit.licenseUrl ? (
                        <a
                          href={credit.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer license"
                          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent transition-colors hover:text-foreground"
                        >
                          {credit.license || t("licenseLabel")}
                          <ExternalLink aria-hidden="true" className="size-3" />
                        </a>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                          {credit.license || t("licenseLabel")}
                        </span>
                      )}
                      {credit.source ? (
                        <a
                          href={credit.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint transition-colors hover:text-accent"
                        >
                          {t("sourceLabel")}
                          <ExternalLink aria-hidden="true" className="size-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Card className="mt-6 p-8 text-sm text-muted">{t("empty")}</Card>
        )}
      </div>
    </main>
  );
}
