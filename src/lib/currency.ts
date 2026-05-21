import type { Currency } from "./types";

const FALLBACK_USD_TO_IDR = Number(process.env.FALLBACK_USD_TO_IDR ?? 16000);

/**
 * Format a price for display. Prices stored as whole USD or whole IDR.
 */
export function formatPrice(
  amount: number,
  currency: Currency,
  locale = "en-US",
): string {
  if (currency === "IDR") {
    return new Intl.NumberFormat(locale === "en-US" ? "id-ID" : locale, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Convert USD to IDR using fallback rate.
 * For production, replace with a real-time exchange rate API.
 */
export function usdToIdr(usd: number): number {
  return Math.round(usd * FALLBACK_USD_TO_IDR);
}

export function idrToUsd(idr: number): number {
  return Number((idr / FALLBACK_USD_TO_IDR).toFixed(2));
}
