export const COUNTRY_CODES = [
  "US",
  "MX",
  "ES",
  "CA",
  "GB",
  "DE",
  "FR",
  "IT",
  "NL",
  "JP",
  "AU",
  "BR",
  "CL",
  "CO",
  "AR",
];

/** Localized country name; falls back to the ISO code when unsupported. */
export function regionName(locale: string, code: string): string {
  try {
    return (
      new Intl.DisplayNames([locale === "es" ? "es-MX" : "en-US"], {
        type: "region",
      }).of(code) ?? code
    );
  } catch {
    return code;
  }
}
