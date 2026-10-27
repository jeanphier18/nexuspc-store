import {
  ArrowRight,
  ChevronDown,
  Clock,
  Mail,
  Package,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackgroundArt } from "@/components/layout/BackgroundArt";
import { SupportForm } from "@/components/support/SupportForm";
import { buttonVariants } from "@/components/ui/Button";
import { faq, faqTopics, policies } from "@/data/support";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "support" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/soporte"),
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("support");
  const key = locale === "en" ? "en" : "es";
  const faqItems = faq[key];
  const policyCopy = policies[key];

  const policyCards = [
    { key: "shipping" as const, id: "envios", Icon: Truck },
    { key: "returns" as const, id: "devoluciones", Icon: RotateCcw },
    { key: "warranty" as const, id: "garantia", Icon: ShieldCheck },
  ];

  const quickLinks = [
    { label: t("quick.orders"), href: "#pedidos" },
    { label: t("quick.shipping"), href: "#envios" },
    { label: t("quick.returns"), href: "#devoluciones" },
    { label: t("quick.warranty"), href: "#garantia" },
    { label: t("faq.title"), href: "#faq" },
    { label: t("form.title"), href: "#contacto" },
  ];

  return (
    <main className="relative isolate mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <BackgroundArt
        items={[
          {
            id: "support-headset",
            src: "/products/headset-a.webp",
            label: "AUDIO",
            side: "right",
            top: "7%",
            depth: 0.9,
            width: "clamp(180px, 13vw, 220px)",
          },
          {
            id: "support-monitor",
            src: "/products/monitor-lg-b.webp",
            label: "DISPLAY",
            side: "left",
            top: "64%",
            depth: 1.2,
            width: "clamp(170px, 12vw, 210px)",
          },
        ]}
      />
      <header className="max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          {t("kicker")}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          {t("intro")}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/[0.07] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-success">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            {t("status")}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
            {t("demo")}
          </span>
        </div>
      </header>

      <nav
        aria-label={t("quickLabel")}
        className="mt-8 flex flex-wrap gap-2"
      >
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full border border-line bg-surface/40 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors duration-fast hover:border-accent/50 hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {policyCards.map(({ key: policyKey, id, Icon }) => {
          const policy = policyCopy[policyKey];
          return (
            <div
              key={policyKey}
              id={id}
              className="scroll-mt-24 rounded-card border border-line bg-surface/40 p-5"
            >
              <span className="flex size-9 items-center justify-center rounded-sm border border-line bg-surface-2/60 text-accent">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <h2 className="mt-4 font-display text-lg leading-snug">
                {t(`policies.${policyKey}.title`)}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {policy.body}
              </p>
              <ul className="mt-4 space-y-2 border-t border-line/70 pt-4">
                {policy.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-[11px] leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1 shrink-0 rotate-45 bg-accent/70"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section id="faq" className="scroll-mt-24">
          <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] sm:text-3xl">
            {t("faq.title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("faq.body")}
          </p>

          <div className="mt-8 space-y-8">
            {faqTopics.map((topic) => {
              const items = faqItems.filter((item) => item.topic === topic);
              if (items.length === 0) return null;

              return (
                <div key={topic}>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    {t(`faq.groups.${topic}`)}
                  </h3>
                  <div className="mt-3 border-t border-line/70">
                    {items.map((item) => (
                      <details
                        key={item.id}
                        className="group border-b border-line/70"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-sm font-medium text-foreground transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                          {item.question}
                          <ChevronDown
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-faint transition-transform duration-fast group-open:rotate-180"
                          />
                        </summary>
                        <p className="pb-4 pr-6 text-xs leading-relaxed text-muted">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div
            id="pedidos"
            className="scroll-mt-24 rounded-card border border-line bg-surface/40 p-5"
          >
            <span className="flex size-9 items-center justify-center rounded-sm border border-line bg-surface-2/60 text-accent">
              <Package aria-hidden="true" className="size-4" />
            </span>
            <h2 className="mt-4 font-display text-base leading-snug">
              {t("track.title")}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {t("track.body")}
            </p>
            <Link
              href="/cuenta"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-4 w-full",
              )}
            >
              {t("track.cta")}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>

          <div className="rounded-card border border-line bg-surface/30 p-5">
            <h2 className="font-display text-base leading-snug">
              {t("still.title")}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {t("still.body")}
            </p>
            <a
              href="#contacto"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-foreground"
            >
              {t("still.cta")}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </aside>
      </div>

      <section
        id="contacto"
        className="mt-16 grid gap-8 border-t border-line/70 pt-10 scroll-mt-24 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] sm:text-3xl">
            {t("form.title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("form.body")}
          </p>
          <div className="mt-6">
            <SupportForm />
          </div>
        </div>

        <aside className="lg:pt-16">
          <div className="rounded-card border border-line bg-surface/30 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              {t("contact.response")}
            </p>
            <a
              href={`mailto:${t("contact.email")}`}
              className="mt-2 flex items-center gap-2 break-all font-display text-sm text-accent transition-colors hover:text-foreground"
            >
              <Mail aria-hidden="true" className="size-3.5 shrink-0" />
              {t("contact.email")}
            </a>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <Clock aria-hidden="true" className="size-3.5 text-faint" />
              {t("contact.hours")}
            </p>
            <p className="mt-4 border-t border-line/70 pt-3 text-[11px] leading-relaxed text-faint">
              {t("demo")}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
