"use client";

import { Compass, Home, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="relative mx-auto flex min-h-[70svh] max-w-3xl flex-col items-start justify-center overflow-hidden px-5 py-24 sm:px-8">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(6rem,20vw,14rem)] font-semibold leading-none tracking-[-0.06em] text-white/[0.035]"
      >
        404
      </p>

      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
        {t("kicker")}
      </p>
      <h1 className="relative mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
        {t("title")}
      </h1>
      <p className="relative mt-4 max-w-md text-sm leading-relaxed text-muted">
        {t("body")}
      </p>

      <div className="relative mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          <Home aria-hidden="true" className="size-4" />
          {t("home")}
        </Link>
        <Link
          href="/tienda"
          className={buttonVariants({ variant: "outline", size: "md" })}
        >
          <ShoppingBag aria-hidden="true" className="size-4" />
          {t("shop")}
        </Link>
      </div>

      <p className="relative mt-8 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
        <Compass aria-hidden="true" className="size-3.5" />
        {t("hint")}
      </p>
    </main>
  );
}
