"use client";

import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Link, useRouter } from "@/i18n/navigation";

type Result = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  priceCents: number;
  stock: "in" | "low" | "out";
  isNew: boolean;
};

export function SearchDialog() {
  const t = useTranslations("search");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();

  const close = () => {
    dialogRef.current?.close();
  };

  const openDialog = () => {
    setOpen(true);
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 20);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) return;
        openDialog();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.target === dialogRef.current) close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const value = query.trim();
    if (value.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as { results: Result[] };
        setResults(data.results ?? []);
        setActive(0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 140);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  const go = (result?: Result) => {
    close();
    if (result) {
      router.push(`/producto/${result.slug}`);
      return;
    }
    const value = query.trim();
    if (value.length >= 2) router.push(`/buscar?q=${encodeURIComponent(value)}`);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  };

  const activeResult = results[active];
  const hasQuery = query.trim().length >= 2;

  return (
    <>
      <button
        type="button"
        data-search-trigger
        onClick={openDialog}
        aria-label={t("open")}
        aria-haspopup="dialog"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative",
        )}
      >
        <Search aria-hidden="true" className="size-5" />
        <span className="sr-only">{t("open")}</span>
      </button>

      <dialog
        ref={dialogRef}
        data-search-dialog
        aria-label={t("title")}
        onClose={() => {
          setOpen(false);
          setQuery("");
          setResults([]);
          document.documentElement.style.overflow = "";
        }}
        className="m-auto w-[min(680px,calc(100vw-2rem))] max-w-none rounded-card border border-line-strong bg-surface p-0 text-foreground shadow-panel backdrop:bg-background/80 backdrop:backdrop-blur-md"
      >
        <div className="border-b border-line p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <Search aria-hidden="true" className="size-5 shrink-0 text-faint" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={t("placeholder")}
              role="combobox"
              aria-expanded={hasQuery}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeResult ? `${listId}-${activeResult.slug}` : undefined
              }
              className="h-8 w-full bg-transparent text-base text-foreground outline-none placeholder:text-faint"
            />
            {loading ? (
              <Loader2
                aria-hidden="true"
                className="size-4 shrink-0 animate-spin text-accent"
              />
            ) : null}
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="flex size-8 shrink-0 items-center justify-center rounded-sm text-faint transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[min(60vh,440px)] overflow-y-auto p-2">
          {!hasQuery ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted">{t("emptyHint")}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {t("examples")}
              </p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted">{t("noResults")}</p>
              <p className="mt-2 text-xs text-faint">{t("noResultsHint")}</p>
            </div>
          ) : (
            <ul id={listId} role="listbox" aria-label={t("resultsLabel")}>
              {results.map((result, index) => (
                <li
                  key={result.slug}
                  id={`${listId}-${result.slug}`}
                  role="option"
                  aria-selected={index === active}
                >
                  <Link
                    href={`/producto/${result.slug}`}
                    onClick={() => close()}
                    onMouseEnter={() => setActive(index)}
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-sm px-3 py-3 transition-colors",
                      index === active ? "bg-surface-2" : "hover:bg-surface-2/70",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-display text-sm text-foreground">
                          {result.name}
                        </span>
                        {result.isNew ? (
                          <Badge variant="primary">{t("new")}</Badge>
                        ) : null}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        {result.brand} · {navT(`categories.${result.category}`)}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-accent">
                      {formatPrice(result.priceCents, locale)}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 shrink-0",
                        index === active ? "text-accent" : "text-faint",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            {t("hint")}
          </span>
          {hasQuery ? (
            <Link
              href={`/buscar?q=${encodeURIComponent(query.trim())}`}
              onClick={() => close()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
            >
              {t("viewAll")}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
