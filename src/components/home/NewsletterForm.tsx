"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

type Status = "idle" | "done" | "error";

export function NewsletterForm() {
  const t = useTranslations("home.newsletter");
  const [status, setStatus] = useState<Status>("idle");

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-sm border border-success/40 bg-success/10 px-4 py-4"
      >
        <Check aria-hidden="true" className="size-5 shrink-0 text-success" />
        <p className="text-sm text-foreground">{t("success")}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = String(data.get("email") ?? "").trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setStatus("error");
          return;
        }

        setStatus("done");
      }}
      className="space-y-3"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {t("emailLabel")}
        </label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("placeholder")}
          aria-invalid={status === "error"}
          aria-describedby="newsletter-hint"
          onChange={() => {
            if (status === "error") setStatus("idle");
          }}
          className="border-line-strong bg-background/60 sm:flex-1"
        />
        <Button type="submit" className="shrink-0">
          {t("cta")}
        </Button>
      </div>

      <p
        id="newsletter-hint"
        role={status === "error" ? "alert" : undefined}
        className={cn(
          "text-[11px]",
          status === "error" ? "text-danger" : "text-faint",
        )}
      >
        {status === "error" ? t("error") : t("privacy")}
      </p>
    </form>
  );
}
