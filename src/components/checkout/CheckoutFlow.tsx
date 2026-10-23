"use client";

import {
  Check,
  ChevronDown,
  CreditCard,
  Loader2,
  Lock,
  ShoppingCart,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { useCartHydrated } from "@/components/cart/useCartHydrated";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { getProduct } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { selectSubtotalCents, useCartStore } from "@/lib/cart";
import {
  computeTotals,
  createOrderId,
  shippingCents,
  type ShippingMethod,
} from "@/lib/checkout";
import { saveOrder, type Order, type OrderLine } from "@/lib/orders";
import { cn } from "@/lib/cn";
import { COUNTRY_CODES, regionName } from "@/lib/countries";
import { formatLongDate, formatPrice } from "@/lib/format";

const STEPS = ["contact", "shipping", "payment"] as const;

type FormState = {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  method: ShippingMethod;
  card: string;
  holder: string;
  expiry: string;
  cvc: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  email: "",
  name: "",
  phone: "",
  address: "",
  city: "",
  postal: "",
  country: "",
  method: "standard",
  card: "",
  holder: "",
  expiry: "",
  cvc: "",
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");

function formatCard(value: string): string {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CheckoutFlow() {
  const t = useTranslations("checkout");
  const cartT = useTranslations("cart");
  const locale = useLocale();
  const hydrated = useCartHydrated();

  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore(selectSubtotalCents);
  const clear = useCartStore((state) => state.clear);

  const lines = items.flatMap((item) => {
    const product = getProduct(item.slug);
    return product ? [{ ...item, product }] : [];
  });

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const countryNames = useMemo(
    () =>
      COUNTRY_CODES.map((code) => ({
        code,
        label: regionName(locale, code),
      })),
    [locale],
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) =>
      previous[key] ? { ...previous, [key]: undefined } : previous,
    );
  };

  const collectErrors = (target: number): Errors => {
    const next: Errors = {};

    if (target === 0) {
      if (!form.email.trim()) next.email = t("errors.required");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
        next.email = t("errors.email");
      if (form.name.trim().length < 2) next.name = t("errors.required");
    }

    if (target === 1) {
      if (form.address.trim().length < 4) next.address = t("errors.required");
      if (form.city.trim().length < 2) next.city = t("errors.required");
      if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(form.postal.trim()))
        next.postal = t("errors.required");
      if (!form.country) next.country = t("errors.required");
    }

    if (target === 2) {
      if (onlyDigits(form.card).length !== 16) next.card = t("errors.card");
      if (form.holder.trim().length < 3) next.holder = t("errors.required");

      const match = form.expiry.match(/^(\d{2})\/(\d{2})$/);

      if (!match) {
        next.expiry = t("errors.expiry");
      } else {
        const month = Number(match[1]);
        const year = 2000 + Number(match[2]);
        const now = new Date();

        if (month < 1 || month > 12) {
          next.expiry = t("errors.expiry");
        } else if (
          year < now.getFullYear() ||
          (year === now.getFullYear() && month < now.getMonth() + 1)
        ) {
          next.expiry = t("errors.expiryPast");
        }
      }

      if (onlyDigits(form.cvc).length !== 3) next.cvc = t("errors.cvc");
    }

    return next;
  };

  const applyErrors = (next: Errors): boolean => {
    setErrors(next);
    const firstKey = Object.keys(next)[0];

    if (firstKey) {
      window.requestAnimationFrame(() => {
        document.getElementById(firstKey)?.focus();
      });
    }

    return Object.keys(next).length === 0;
  };

  const goToStep = (target: number) => {
    setErrors({});
    setStep(target);
  };

  const placeOrder = () => {
    const snapshot: OrderLine[] = lines.map(({ product, qty }) => ({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      qty,
      priceCents: product.priceCents,
    }));
    const totals = computeTotals(subtotal, form.method);

    setProcessing(true);

    timer.current = window.setTimeout(() => {
      const placed: Order = {
        id: createOrderId(),
        createdAt: new Date().toISOString(),
        email: form.email.trim(),
        name: form.name.trim(),
        method: form.method,
        items: snapshot,
        address: {
          line: form.address.trim(),
          city: form.city.trim(),
          postal: form.postal.trim().toUpperCase(),
          country: form.country,
        },
        ...totals,
      };

      saveOrder(placed);
      setOrder(placed);
      setProcessing(false);
      clear();
    }, 1500);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (processing) return;

    if (step < STEPS.length - 1) {
      if (applyErrors(collectErrors(step))) setStep(step + 1);
      return;
    }

    const perStep = [collectErrors(0), collectErrors(1), collectErrors(2)];
    const merged = Object.assign({}, ...perStep);

    if (Object.keys(merged).length > 0) {
      const firstInvalid = perStep.findIndex(
        (candidate) => Object.keys(candidate).length > 0,
      );
      setStep(firstInvalid === -1 ? 0 : firstInvalid);
      applyErrors(merged);
      return;
    }

    placeOrder();
  };

  const totals = computeTotals(subtotal, form.method);
  const isEmpty = hydrated && lines.length === 0 && !order;

  if (order) {
    const delivery = new Date(
      Date.now() + (order.method === "express" ? 2 : 5) * 86_400_000,
    );

    return (
      <div className="mx-auto max-w-3xl">
        <Card className="relative overflow-hidden p-6 sm:p-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-64"
            style={{
              background:
                "radial-gradient(55% 90% at 50% 0%, rgba(124,58,237,0.25), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center text-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
              <Check aria-hidden="true" className="size-8" />
            </span>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              {t("confirmation.order", { id: order.id })}
            </p>
            <h1 className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              {t("confirmation.title")}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              {t("confirmation.body", {
                name: order.name,
                email: order.email,
              })}
            </p>
            <p className="mt-2 font-mono text-[11px] text-faint">
              {t("confirmation.delivery", {
                date: formatLongDate(delivery, locale),
              })}
            </p>

            <div className="mt-8 w-full max-w-lg rounded-md border border-line bg-surface/50 p-5 text-left">
              <ul className="divide-y divide-line/70">
                {order.items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex items-start justify-between gap-3 py-2.5 text-xs"
                  >
                    <span className="min-w-0">
                      <span className="font-mono text-faint">
                        {item.qty}×{" "}
                      </span>
                      {item.name}
                    </span>
                    <span className="shrink-0 font-mono tabular-nums text-muted">
                      {formatPrice(item.priceCents * item.qty, locale)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-line pt-4">
                <OrderTotals
                  subtotalCents={order.subtotal}
                  method={order.method}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tienda"
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                {t("confirmation.keepShopping")}
              </Link>
              <Link
                href="/"
                className={buttonVariants({ variant: "outline", size: "md" })}
              >
                {t("confirmation.home")}
              </Link>
            </div>

            <p className="mt-6 max-w-sm text-[10px] leading-relaxed text-faint">
              {t("confirmation.note")}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {t("title")}
            </h1>
            <Badge variant="accent">{t("demoBadge")}</Badge>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {t("intro")}
          </p>
        </div>
      </header>

      {!hydrated ? (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="p-6">
            <div className="h-64 animate-pulse rounded-sm bg-surface-2/60" />
          </Card>
          <Card className="p-6">
            <div className="h-52 animate-pulse rounded-sm bg-surface-2/60" />
          </Card>
        </div>
      ) : isEmpty ? (
        <Card className="mt-8 flex flex-col items-center px-6 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border border-line bg-surface-2/60">
            <ShoppingCart aria-hidden="true" className="size-6 text-faint" />
          </span>
          <h2 className="mt-5 font-display text-xl">{t("empty.title")}</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {t("empty.body")}
          </p>
          <Link
            href="/tienda"
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "mt-6",
            )}
          >
            {t("empty.cta")}
          </Link>
        </Card>
      ) : (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <ol className="flex items-center">
              {STEPS.map((key, index) => {
                const done = index < step;
                const active = index === step;

                return (
                  <li key={key} className="flex items-center">
                    <button
                      type="button"
                      disabled={!done}
                      onClick={() => done && goToStep(index)}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "flex items-center gap-2",
                        done && "cursor-pointer",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full border font-mono text-[11px] transition-colors",
                          active && "border-accent bg-accent/15 text-accent",
                          done && "border-accent/40 bg-accent/10 text-accent",
                          !active &&
                            !done &&
                            "border-line text-faint",
                        )}
                      >
                        {done ? (
                          <Check aria-hidden="true" className="size-3.5" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span
                        className={cn(
                          "hidden font-mono text-[10px] uppercase tracking-[0.14em] sm:inline",
                          active ? "text-foreground" : "text-faint",
                        )}
                      >
                        {t(`steps.${key}`)}
                      </span>
                    </button>
                    {index < STEPS.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mx-3 h-px w-8 sm:w-16",
                          done ? "bg-accent/40" : "bg-line",
                        )}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>

            <form onSubmit={handleSubmit} noValidate className="mt-5">
              <Card className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-medium leading-snug">
                      {t(`${STEPS[step]}.title`)}
                    </h2>
                    <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted">
                      {t(`${STEPS[step]}.body`)}
                    </p>
                  </div>
                  <span
                    aria-live="polite"
                    className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-faint"
                  >
                    {t("step", { current: step + 1, total: STEPS.length })}
                  </span>
                </div>

                {step === 0 ? (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field
                      label={t("contact.email")}
                      htmlFor="email"
                      error={errors.email}
                      className="sm:col-span-2"
                    >
                      <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder={t("contact.emailPlaceholder")}
                        value={form.email}
                        onChange={(event) =>
                          update("email", event.target.value)
                        }
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        className={cn(
                          errors.email &&
                            "border-danger/60 focus:border-danger focus:ring-danger/30",
                        )}
                      />
                    </Field>

                    <Field
                      label={t("contact.name")}
                      htmlFor="name"
                      error={errors.name}
                    >
                      <Input
                        id="name"
                        autoComplete="name"
                        placeholder={t("contact.namePlaceholder")}
                        value={form.name}
                        onChange={(event) => update("name", event.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? "name-error" : undefined
                        }
                        className={cn(
                          errors.name &&
                            "border-danger/60 focus:border-danger focus:ring-danger/30",
                        )}
                      />
                    </Field>

                    <Field
                      label={t("contact.phone")}
                      htmlFor="phone"
                      error={errors.phone}
                    >
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder={t("contact.phonePlaceholder")}
                        value={form.phone}
                        onChange={(event) =>
                          update("phone", event.target.value)
                        }
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={
                          errors.phone ? "phone-error" : undefined
                        }
                      />
                    </Field>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field
                      label={t("shipping.address")}
                      htmlFor="address"
                      error={errors.address}
                      className="sm:col-span-2"
                    >
                      <Input
                        id="address"
                        autoComplete="street-address"
                        placeholder={t("shipping.addressPlaceholder")}
                        value={form.address}
                        onChange={(event) =>
                          update("address", event.target.value)
                        }
                        aria-invalid={Boolean(errors.address)}
                        aria-describedby={
                          errors.address ? "address-error" : undefined
                        }
                        className={cn(
                          errors.address &&
                            "border-danger/60 focus:border-danger focus:ring-danger/30",
                        )}
                      />
                    </Field>

                    <Field
                      label={t("shipping.city")}
                      htmlFor="city"
                      error={errors.city}
                    >
                      <Input
                        id="city"
                        autoComplete="address-level2"
                        placeholder={t("shipping.cityPlaceholder")}
                        value={form.city}
                        onChange={(event) => update("city", event.target.value)}
                        aria-invalid={Boolean(errors.city)}
                        aria-describedby={
                          errors.city ? "city-error" : undefined
                        }
                        className={cn(
                          errors.city &&
                            "border-danger/60 focus:border-danger focus:ring-danger/30",
                        )}
                      />
                    </Field>

                    <Field
                      label={t("shipping.postal")}
                      htmlFor="postal"
                      error={errors.postal}
                    >
                      <Input
                        id="postal"
                        autoComplete="postal-code"
                        placeholder={t("shipping.postalPlaceholder")}
                        value={form.postal}
                        onChange={(event) =>
                          update("postal", event.target.value)
                        }
                        aria-invalid={Boolean(errors.postal)}
                        aria-describedby={
                          errors.postal ? "postal-error" : undefined
                        }
                        className={cn(
                          errors.postal &&
                            "border-danger/60 focus:border-danger focus:ring-danger/30",
                        )}
                      />
                    </Field>

                    <Field
                      label={t("shipping.country")}
                      htmlFor="country"
                      error={errors.country}
                      className="sm:col-span-2"
                    >
                      <div className="relative">
                        <select
                          id="country"
                          autoComplete="country-name"
                          value={form.country}
                          onChange={(event) =>
                            update("country", event.target.value)
                          }
                          aria-invalid={Boolean(errors.country)}
                          aria-describedby={
                            errors.country ? "country-error" : undefined
                          }
                          className={cn(
                            "h-11 w-full appearance-none rounded-sm border border-line bg-surface/70 px-4 pr-10 text-sm text-foreground transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40",
                            !form.country && "text-faint",
                            errors.country &&
                              "border-danger/60 focus:border-danger focus:ring-danger/30",
                          )}
                        >
                          <option value="" disabled>
                            {t("shipping.countryPlaceholder")}
                          </option>
                          {countryNames.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint"
                        />
                      </div>
                    </Field>

                    <div className="sm:col-span-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                        {t("shipping.method")}
                      </p>
                      <div className="mt-2.5 space-y-2">
                        {(["standard", "express"] as const).map((method) => {
                          const selected = form.method === method;
                          const cost = shippingCents(subtotal, method);

                          return (
                            <label
                              key={method}
                              className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-sm border p-3 transition-colors duration-fast",
                                selected
                                  ? "border-accent/60 bg-accent/5"
                                  : "border-line bg-surface/50 hover:border-line-strong",
                              )}
                            >
                              <input
                                type="radio"
                                name="method"
                                value={method}
                                checked={selected}
                                onChange={() => update("method", method)}
                                className="sr-only"
                              />
                              <span
                                className={cn(
                                  "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                                  selected
                                    ? "border-accent"
                                    : "border-line-strong",
                                )}
                              >
                                {selected ? (
                                  <span className="size-2 rounded-full bg-accent" />
                                ) : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[13px] text-foreground">
                                  {t(`shipping.${method}`)}
                                </span>
                                <span className="block font-mono text-[10px] text-faint">
                                  {t(`shipping.${method}Eta`)}
                                </span>
                              </span>
                              <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">
                                {cost === 0 ? (
                                  <span className="text-success">
                                    {cartT("freeShipping")}
                                  </span>
                                ) : (
                                  formatPrice(cost, locale)
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="mt-6">
                    <div className="relative overflow-hidden rounded-lg border border-line-strong bg-gradient-to-br from-primary/35 via-surface-2 to-accent/15 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                          {t("payment.cardLabel")}
                        </span>
                        <CreditCard
                          aria-hidden="true"
                          className="size-5 text-accent"
                        />
                      </div>
                      <p className="mt-8 font-mono text-base tracking-[0.16em] text-foreground/90 sm:text-lg">
                        {form.card || "•••• •••• •••• ••••"}
                      </p>
                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                            {t("payment.holder")}
                          </p>
                          <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/80">
                            {form.holder || "—"}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                            {t("payment.expiry")}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-foreground/80">
                            {form.expiry || "MM/YY"}
                          </p>
                        </div>
                      </div>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-accent/10 blur-2xl"
                      />
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <Field
                        label={t("payment.card")}
                        htmlFor="card"
                        error={errors.card}
                        className="sm:col-span-2"
                      >
                        <Input
                          id="card"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder={t("payment.cardPlaceholder")}
                          value={form.card}
                          onChange={(event) =>
                            update("card", formatCard(event.target.value))
                          }
                          aria-invalid={Boolean(errors.card)}
                          aria-describedby={
                            errors.card ? "card-error" : undefined
                          }
                          className={cn(
                            errors.card &&
                              "border-danger/60 focus:border-danger focus:ring-danger/30",
                          )}
                        />
                      </Field>

                      <Field
                        label={t("payment.holder")}
                        htmlFor="holder"
                        error={errors.holder}
                        className="sm:col-span-2"
                      >
                        <Input
                          id="holder"
                          autoComplete="cc-name"
                          placeholder={t("payment.holderPlaceholder")}
                          value={form.holder}
                          onChange={(event) =>
                            update("holder", event.target.value)
                          }
                          aria-invalid={Boolean(errors.holder)}
                          aria-describedby={
                            errors.holder ? "holder-error" : undefined
                          }
                          className={cn(
                            errors.holder &&
                              "border-danger/60 focus:border-danger focus:ring-danger/30",
                          )}
                        />
                      </Field>

                      <Field
                        label={t("payment.expiry")}
                        htmlFor="expiry"
                        error={errors.expiry}
                      >
                        <Input
                          id="expiry"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder={t("payment.expiryPlaceholder")}
                          value={form.expiry}
                          onChange={(event) =>
                            update("expiry", formatExpiry(event.target.value))
                          }
                          aria-invalid={Boolean(errors.expiry)}
                          aria-describedby={
                            errors.expiry ? "expiry-error" : undefined
                          }
                          className={cn(
                            errors.expiry &&
                              "border-danger/60 focus:border-danger focus:ring-danger/30",
                          )}
                        />
                      </Field>

                      <Field
                        label={t("payment.cvc")}
                        htmlFor="cvc"
                        error={errors.cvc}
                      >
                        <Input
                          id="cvc"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder={t("payment.cvcPlaceholder")}
                          value={form.cvc}
                          onChange={(event) =>
                            update(
                              "cvc",
                              onlyDigits(event.target.value).slice(0, 3),
                            )
                          }
                          aria-invalid={Boolean(errors.cvc)}
                          aria-describedby={
                            errors.cvc ? "cvc-error" : undefined
                          }
                          className={cn(
                            errors.cvc &&
                              "border-danger/60 focus:border-danger focus:ring-danger/30",
                          )}
                        />
                      </Field>
                    </div>

                    <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-faint">
                      <Lock
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-accent"
                      />
                      {t("payment.testCard")}
                    </p>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                  {step > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => goToStep(step - 1)}
                      disabled={processing}
                    >
                      {t("actions.back")}
                    </Button>
                  ) : (
                    <span className="hidden sm:block" />
                  )}

                  <Button
                    type="submit"
                    size="md"
                    disabled={processing}
                    className="w-full sm:w-auto"
                  >
                    {processing ? (
                      <>
                        <Loader2
                          aria-hidden="true"
                          className="size-4 animate-spin"
                        />
                        {t("actions.processing")}
                      </>
                    ) : step === STEPS.length - 1 ? (
                      t("actions.pay", {
                        amount: formatPrice(totals.total, locale),
                      })
                    ) : (
                      t("actions.continue")
                    )}
                  </Button>
                </div>
              </Card>
            </form>
          </div>

          <aside className="lg:sticky lg:top-24">
            <Card className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                {t("summary.title")}
              </p>

              <ul className="mt-4 divide-y divide-line/70">
                {lines.map(({ product, qty }) => (
                  <li
                    key={product.slug}
                    className="flex items-start justify-between gap-3 py-2.5 text-xs"
                  >
                    <span className="min-w-0">
                      <span className="font-mono text-faint">{qty}× </span>
                      {product.name}
                    </span>
                    <span className="shrink-0 font-mono tabular-nums text-muted">
                      {formatPrice(product.priceCents * qty, locale)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-line pt-4">
                <OrderTotals
                  subtotalCents={subtotal}
                  method={form.method}
                />
              </div>

              <p className="mt-4 text-[10px] leading-relaxed text-faint">
                {t("demoNote")}
              </p>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
