"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { useLocale } from "next-intl";

const shortLabels: Record<string, string> = { es: "ES", en: "EN" };

export function LocaleSwitcher({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-line bg-surface/70 p-1 backdrop-blur",
        className,
      )}
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            hrefLang={loc}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest transition-colors duration-fast",
              active
                ? "bg-primary text-on-primary"
                : "text-muted hover:text-foreground",
            )}
          >
            {shortLabels[loc] ?? loc}
          </Link>
        );
      })}
    </nav>
  );
}
