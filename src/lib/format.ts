import { locale } from "@/config/tokens";

/**
 * Format a value in Colombian Pesos, es-CO style.
 * COP has no minor units in practice → 0 fraction digits.
 *   formatCOP(289900) → "$ 289.900"
 */
const copFormatter = new Intl.NumberFormat(locale.lang, {
  style: "currency",
  currency: locale.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  return copFormatter.format(value);
}

/** Compact plain-number format, e.g. for counts. */
const numberFormatter = new Intl.NumberFormat(locale.lang);
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Long date in es-CO, e.g. "2 de julio de 2026". */
export function formatDate(value: string | number | Date): string {
  return new Intl.DateTimeFormat(locale.lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
