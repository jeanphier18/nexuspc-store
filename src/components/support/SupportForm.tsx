"use client";

import { Check, ChevronDown, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

const TOPICS = [
  "order",
  "shipping",
  "returns",
  "warranty",
  "product",
  "other",
] as const;

type Topic = (typeof TOPICS)[number];
type ErrorKey = "name" | "email" | "message";

const EMPTY = {
  name: "",
  email: "",
  topic: "order" as Topic,
  order: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function SupportForm() {
  const t = useTranslations("support.form");
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ref: string; email: string } | null>(
    null,
  );

  function update<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    if (key === "name" || key === "email" || key === "message") {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Partial<Record<ErrorKey, string>> = {};
    if (values.name.trim().length < 2) next.name = t("nameShort");
    if (!EMAIL_RE.test(values.email.trim())) next.email = t("emailInvalid");
    if (values.message.trim().length < 10) next.message = t("messageShort");

    if (Object.keys(next).length > 0) {
      setErrors(next);
      const first = Object.keys(next)[0];
      requestAnimationFrame(() => {
        document.getElementById(first)?.focus();
      });
      return;
    }

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setResult({
      ref: `SUP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      email: values.email.trim(),
    });
    setSending(false);
  }

  if (result) {
    return (
      <div
        role="status"
        className="rounded-card border border-success/30 bg-success/[0.06] p-6 sm:p-8"
      >
        <span className="flex size-10 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
          <Check aria-hidden="true" className="size-5" />
        </span>
        <h3 className="mt-4 font-display text-xl leading-snug tracking-[-0.01em]">
          {t("successTitle")}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {t("successBody", { email: result.email, ref: result.ref })}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() => {
            setResult(null);
            setValues(EMPTY);
            setErrors({});
          }}
        >
          {t("again")}
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-card border border-line bg-surface/40 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="name" error={errors.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(errors.name && "border-danger/60")}
          />
        </Field>

        <Field label={t("email")} htmlFor="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(errors.email && "border-danger/60")}
          />
        </Field>

        <Field label={t("topic")} htmlFor="topic">
          <div className="relative">
            <select
              id="topic"
              name="topic"
              value={values.topic}
              onChange={(event) => update("topic", event.target.value as Topic)}
              className="h-11 w-full appearance-none rounded-sm border border-line bg-surface/70 px-4 pr-10 text-sm text-foreground transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
            >
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {t(`topics.${topic}`)}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint"
            />
          </div>
        </Field>

        <Field label={t("order")} htmlFor="order" hint={t("orderHint")}>
          <Input
            id="order"
            name="order"
            autoComplete="off"
            placeholder="NX-XXXXXX"
            value={values.order}
            onChange={(event) => update("order", event.target.value)}
          />
        </Field>

        <Field
          label={t("message")}
          htmlFor="message"
          error={errors.message}
          hint={t("messageHint")}
          className="sm:col-span-2"
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={cn(
              "min-h-32 w-full resize-y rounded-sm border border-line bg-surface/70 px-4 py-3 text-sm text-foreground transition-colors placeholder:text-faint hover:border-line-strong focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40",
              errors.message && "border-danger/60",
            )}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="submit" variant="accent" disabled={sending}>
          {sending ? t("sending") : t("submit")}
          <Send aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </form>
  );
}
