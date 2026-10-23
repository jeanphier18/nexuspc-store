import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { categoryIcons } from "@/config/category-icons";
import type { Guide } from "@/data/guides";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/format";

function guideCopy(guide: Guide, locale: string) {
  return guide.copy[locale === "en" ? "en" : "es"];
}

export async function GuideCard({
  guide,
  locale,
  featured = false,
  headingLevel = "h2",
}: {
  guide: Guide;
  locale: string;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const t = await getTranslations("guides");
  const navT = await getTranslations("nav");
  const copy = guideCopy(guide, locale);
  const Icon = categoryIcons[guide.category];
  const categoryLabel = navT(`categories.${guide.category}`);
  const Heading = headingLevel;

  if (featured) {
    return (
      <article className="group relative mt-10 overflow-hidden rounded-card border border-line bg-surface/40 transition-colors duration-base hover:border-accent/40">
        <Link
          href={`/guias/${guide.slug}`}
          className="grid md:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {t("featured")}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                {categoryLabel} ·{" "}
                {t("readTime", { minutes: guide.readMinutes })}
              </span>
            </div>

            <Heading className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.02em] transition-colors duration-base group-hover:text-accent">
              {copy.title}
            </Heading>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              {copy.excerpt}
            </p>

            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
              {t("read")}
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-fast group-hover:translate-x-0.5"
              />
            </span>
          </div>

          <div
            aria-hidden="true"
            className="relative hidden min-h-[300px] overflow-hidden border-l border-line md:block"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(420px circle at 70% 20%, rgba(0,229,255,0.16), transparent 65%), radial-gradient(380px circle at 20% 90%, rgba(124,58,237,0.24), transparent 65%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <Icon className="absolute right-8 top-1/2 size-28 -translate-y-1/2 text-accent/25 transition-transform duration-slow group-hover:scale-105" />
            <p className="absolute bottom-6 left-8 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
              {t("published", {
                date: formatShortDate(new Date(guide.date), locale),
              })}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-card border border-line bg-surface/40 p-5",
        "transition-colors duration-base hover:border-line-strong",
      )}
    >
      <Link
        href={`/guias/${guide.slug}`}
        className="flex flex-1 flex-col rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent/70"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex min-w-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
            <Icon aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{categoryLabel}</span>
          </span>
          <span className="shrink-0 font-mono text-[9px] text-faint">
            {t("readTime", { minutes: guide.readMinutes })}
          </span>
        </div>

        <Heading className="mt-4 font-display text-lg leading-snug tracking-[-0.01em] transition-colors duration-base group-hover:text-accent">
          {copy.title}
        </Heading>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
          {copy.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          <span>{t(`level.${guide.level}`)}</span>
          <span className="inline-flex items-center gap-1 text-accent">
            {t("read")}
            <ArrowRight aria-hidden="true" className="size-3" />
          </span>
        </div>
      </Link>
    </article>
  );
}
