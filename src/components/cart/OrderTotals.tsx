"use client";

import { useLocale, useTranslations } from "next-intl";
import { computeTotals, type ShippingMethod } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";

export function OrderTotals({
  subtotalCents,
  method = "standard",
}: {
  subtotalCents: number;
  method?: ShippingMethod;
}) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { shipping, taxes, total } = computeTotals(subtotalCents, method);

  return (
    <dl className="space-y-3 text-sm">
      <div className="flex items-center justify-between gap-4">
        <dt className="text-muted">{t("subtotal")}</dt>
        <dd className="font-mono tabular-nums">
          {formatPrice(subtotalCents, locale)}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-4">
        <dt className="text-muted">{t("shipping")}</dt>
        <dd className="font-mono tabular-nums">
          {shipping === 0 ? (
            <span className="text-success">{t("freeShipping")}</span>
          ) : (
            formatPrice(shipping, locale)
          )}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-4">
        <dt className="text-muted">{t("taxes")}</dt>
        <dd className="font-mono tabular-nums">
          {formatPrice(taxes, locale)}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
        <dt className="font-medium">{t("total")}</dt>
        <dd className="font-mono text-base tabular-nums text-accent">
          {formatPrice(total, locale)}
        </dd>
      </div>
    </dl>
  );
}
