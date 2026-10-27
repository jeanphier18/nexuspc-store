"use client";

import { ChevronDown, Menu, Scale, ShoppingCart, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { CartBadge } from "@/components/cart/CartBadge";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { SearchDialog } from "@/components/search/SearchDialog";
import { buttonVariants } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { categoryIcons } from "@/config/category-icons";
import { categories, mainNav } from "@/config/nav";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const megaRef = useRef<HTMLDivElement | null>(null);
  const megaButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileRef = useRef<HTMLDialogElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const megaOpenRef = useRef(false);

  megaOpenRef.current = megaOpen;

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        setHidden(y > 160 && y > lastY + 4 && !megaOpenRef.current);
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!megaOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!megaRef.current?.contains(event.target as Node)) {
        setMegaOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMegaOpen(false);
        megaButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [megaOpen]);

  useEffect(() => {
    setMegaOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const scheduleCloseMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 180);
  };

  const openMobile = () => {
    mobileRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  const closeMobile = () => {
    mobileRef.current?.close();
    document.documentElement.style.overflow = "";
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-transform duration-slow ease-out",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div
        className={cn(
          "border-b transition-colors duration-base",
          scrolled || megaOpen
            ? "border-line bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
          <Link
            href="/"
            aria-label={t("home")}
            className="shrink-0 rounded-xs transition-opacity hover:opacity-85"
          >
            <Logo />
          </Link>

          <nav aria-label={t("main")} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) =>
                item.key === "shop" ? (
                  <li key={item.key}>
                    <div
                      ref={megaRef}
                      className="relative"
                      onMouseEnter={openMega}
                      onMouseLeave={scheduleCloseMega}
                    >
                      <button
                        ref={megaButtonRef}
                        type="button"
                        aria-expanded={megaOpen}
                        aria-controls="mega-menu"
                        onClick={() => setMegaOpen((value) => !value)}
                        className={cn(
                          "inline-flex h-9 items-center gap-1.5 rounded-xs px-3 text-sm transition-colors duration-fast",
                          megaOpen
                            ? "bg-surface text-foreground"
                            : "text-muted hover:bg-surface/60 hover:text-foreground",
                        )}
                      >
                        {t("shop")}
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            "size-3.5 transition-transform duration-fast",
                            megaOpen && "rotate-180",
                          )}
                        />
                      </button>

                      {megaOpen ? (
                        <div
                          id="mega-menu"
                          className="fixed inset-x-0 top-16 animate-[menu-in_180ms_ease-out] px-5 sm:px-8"
                        >
                          <div className="mx-auto grid max-w-[920px] gap-6 rounded-card border border-line bg-surface p-6 shadow-panel md:grid-cols-[1fr_280px]">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                                {t("categoriesLabel")}
                              </p>
                              <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                                {categories.map((category) => {
                                  const Icon = categoryIcons[category.key];
                                  return (
                                    <li key={category.key}>
                                      <Link
                                        href={`/tienda/${category.slug}`}
                                        className="group flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors duration-fast hover:bg-surface-2"
                                      >
                                        <Icon
                                          aria-hidden="true"
                                          className="size-4 text-faint transition-colors duration-fast group-hover:text-accent"
                                        />
                                        <span className="text-sm text-muted transition-colors duration-fast group-hover:text-foreground">
                                          {t(`categories.${category.key}`)}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                              <Link
                                href="/tienda"
                                className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-accent hover:text-foreground"
                              >
                                {t("allProducts")} →
                              </Link>
                            </div>

                            <Link
                              href="/guias"
                              className="group relative flex flex-col overflow-hidden rounded-md border border-primary/30 bg-primary/10 p-5 transition-colors duration-fast hover:border-accent/50"
                            >
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0"
                                style={{
                                  background:
                                    "radial-gradient(220px circle at 80% 0%, rgba(0,229,255,0.18), transparent 70%)",
                                }}
                              />
                              <Badge variant="accent" className="self-start">
                                {t("guidesCardBadge")}
                              </Badge>
                              <p className="mt-4 font-display text-lg leading-tight">
                                {t("guidesCard")}
                              </p>
                              <p className="mt-2 text-xs leading-relaxed text-muted">
                                {t("guidesCardDesc")}
                              </p>
                              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                                {t("guidesCardCta")}
                                <span aria-hidden="true" className="transition-transform duration-fast group-hover:translate-x-0.5">
                                  →
                                </span>
                              </span>
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </li>
                ) : (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex h-9 items-center rounded-xs px-3 text-sm transition-colors duration-fast",
                        pathname.startsWith(item.href)
                          ? "text-foreground"
                          : "text-muted hover:bg-surface/60 hover:text-foreground",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <SearchDialog />

            <LocaleSwitcher
              label={t("language")}
              className="hidden sm:flex"
            />

            <Link
              href="/cuenta"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "hidden sm:inline-flex",
              )}
            >
              <User aria-hidden="true" className="size-5" />
              <span className="sr-only">{t("account")}</span>
            </Link>

            <Link
              href="/carrito"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative",
              )}
            >
              <ShoppingCart aria-hidden="true" className="size-5" />
              <span className="sr-only">{t("cart")}</span>
              <CartBadge />
            </Link>

            <button
              type="button"
              onClick={openMobile}
              aria-label={t("openMenu")}
              aria-haspopup="dialog"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "lg:hidden",
              )}
            >
              <Menu aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <dialog
        ref={mobileRef}
        aria-label={t("menu")}
        onClose={() => {
          document.documentElement.style.overflow = "";
        }}
        className="m-0 h-svh max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-background/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col overflow-y-auto bg-background/95 px-5 pb-10 pt-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={closeMobile}
              aria-label={t("closeMenu")}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav aria-label={t("main")} className="mt-8">
            <ul className="space-y-1">
              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center justify-between rounded-sm border border-transparent px-3 py-3 font-display text-xl transition-colors hover:border-line hover:bg-surface/70"
                  >
                    {t(item.key)}
                    <span className="font-mono text-xs text-faint">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 border-t border-line pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              {t("categoriesLabel")}
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-1">
              {categories.map((category) => {
                const Icon = categoryIcons[category.key];
                return (
                  <li key={category.key}>
                    <Link
                      href={`/tienda/${category.slug}`}
                      onClick={closeMobile}
                      className="flex items-center gap-2.5 rounded-sm px-2 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                    >
                      <Icon aria-hidden="true" className="size-4 text-faint" />
                      {t(`categories.${category.key}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Link
              href="/cuenta"
              onClick={closeMobile}
              className="flex items-center gap-2 rounded-sm border border-line px-3 py-2.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-foreground"
            >
              <User aria-hidden="true" className="size-4 text-faint" />
              {t("account")}
            </Link>
            <Link
              href="/comparar"
              onClick={closeMobile}
              className="flex items-center gap-2 rounded-sm border border-line px-3 py-2.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-foreground"
            >
              <Scale aria-hidden="true" className="size-4 text-faint" />
              {t("compare")}
            </Link>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-line pt-6">
            <LocaleSwitcher label={t("language")} />
            <Link
              href="/carrito"
              onClick={closeMobile}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ShoppingCart aria-hidden="true" className="size-4" />
              {t("cart")}
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  );
}
