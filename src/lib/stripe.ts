import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

/**
 * Server-side Stripe client. Lazily-initialized so that builds without the env
 * var don't crash during static analysis (we only ever call this at request time).
 */
export const stripe = key
  ? new Stripe(key, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    })
  : (null as unknown as Stripe);

export function assertStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example).",
    );
  }
  return stripe;
}
