import { CreditCard, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/Logo";
import { Link } from "@/i18n/navigation";
import { footerLinks } from "@/config/nav";

const columnOrder = ["shop", "learn", "support", "company"] as const;

const trust = [
  { key: "shipping", Icon: Truck },
  { key: "warranty", Icon: ShieldCheck },
  { key: "secure", Icon: CreditCard },
  { key: "support", Icon: Sparkles },
] as const;

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative z-10 mt-24 border-t border-line bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {t("blurb")}
            </p>
            <ul className="mt-6 space-y-2.5">
              {trust.map(({ key, Icon }) => (
                <li
                  key={key}
                  className="flex items-center gap-2.5 text-xs text-muted"
                >
                  <Icon aria-hidden="true" className="size-4 text-accent" />
                  {t(`trust.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            {columnOrder.map((column) => (
              <div key={column}>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  {t(`columns.${column}`)}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {footerLinks[column].map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors duration-fast hover:text-foreground"
                      >
                        {t(`links.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            © {new Date().getFullYear()} NEXUS PC — {t("rights")}
          </p>
          <ul className="flex flex-wrap items-center gap-5">
            {(["terms", "privacy", "cookies"] as const).map((key) => (
              <li key={key}>
                <Link
                  href="/soporte"
                  className="text-xs text-faint transition-colors duration-fast hover:text-muted"
                >
                  {t(`legal.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-faint">
          {t("notice")}
        </p>
      </div>
    </footer>
  );
}
