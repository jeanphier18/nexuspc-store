"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "@/i18n/navigation";

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const value = query.trim();
        if (value.length < 2) {
          router.push("/buscar");
          return;
        }
        router.push(`/buscar?q=${encodeURIComponent(value)}`);
      }}
      className="mt-6 flex w-full max-w-xl items-center gap-2"
    >
      <label htmlFor="catalog-search" className="sr-only">
        {t("formLabel")}
      </label>
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint"
        />
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("placeholder")}
          autoComplete="off"
          className="h-11 w-full rounded-sm border border-line bg-surface/70 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-faint focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <Button type="submit" variant="primary" size="md">
        {t("submit")}
      </Button>
    </form>
  );
}
