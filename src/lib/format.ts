const PRICE_LOCALES: Record<string, string> = {
  es: "es-MX",
  en: "en-US",
};

const formatters = new Map<string, Intl.NumberFormat>();
const countFormatters = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string): Intl.NumberFormat {
  const intlLocale = PRICE_LOCALES[locale] ?? "en-US";
  let formatter = formatters.get(intlLocale);

  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
    });
    formatters.set(intlLocale, formatter);
  }

  return formatter;
}

/**
 * Prices are stored in integer cents to avoid floating point drift.
 * USD is formatted with US conventions in both locales so the amount
 * (and the currency) read the same everywhere: $1,299.00
 */
export function formatPrice(cents: number, locale: string): string {
  return getFormatter(locale).format(cents / 100);
}

export function discountPercent(
  priceCents: number,
  compareAtCents?: number,
): number | null {
  if (!compareAtCents || compareAtCents <= priceCents) return null;
  return Math.round((1 - priceCents / compareAtCents) * 100);
}

export function formatCount(value: number, locale: string): string {
  const intlLocale = PRICE_LOCALES[locale] ?? "en-US";
  let formatter = countFormatters.get(intlLocale);

  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale);
    countFormatters.set(intlLocale, formatter);
  }

  return formatter.format(value);
}

export function formatLongDate(date: Date, locale: string): string {
  const intlLocale = PRICE_LOCALES[locale] ?? "en-US";

  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatShortDate(date: Date, locale: string): string {
  const intlLocale = PRICE_LOCALES[locale] ?? "en-US";

  return new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatMonthYear(date: Date, locale: string): string {
  const intlLocale = PRICE_LOCALES[locale] ?? "en-US";

  return new Intl.DateTimeFormat(intlLocale, {
    month: "long",
    year: "numeric",
  }).format(date);
}
