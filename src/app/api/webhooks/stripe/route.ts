import { NextResponse } from "next/server";
import { assertStripe } from "@/lib/stripe";

/**
 * Stripe webhook receiver.
 *
 * Verifies the Stripe-Signature header against STRIPE_WEBHOOK_SECRET,
 * then dispatches handlers per event type. Currently logs and (when
 * RESEND_API_KEY is set) sends an order confirmation email.
 *
 * Configure once in the Stripe Dashboard:
 *   Endpoint URL: https://zen-aura.vercel.app/api/webhooks/stripe
 *   Events:       checkout.session.completed, payment_intent.succeeded
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "ZenAura Bali <orders@zenaura-bali.com>";

async function sendOrderEmail(opts: {
  to: string;
  orderId: string;
  amountTotal: number;
  currency: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY not set" };
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: opts.currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(opts.amountTotal / 100);
  const html = `
    <div style="font-family:Georgia,serif;background:#301934;color:#f5edd1;padding:40px;border-radius:20px;max-width:560px;margin:auto;">
      <div style="text-align:center;color:#eed977;font-size:14px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:24px;">ZenAura · Bali</div>
      <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.15;margin:0 0 14px 0;font-weight:400;">Thank you for your order.</h1>
      <p style="font-size:15px;line-height:1.6;color:rgba(245,237,209,0.85);">
        Your order <strong>${opts.orderId}</strong> for ${formatted} is being prepared in our Ubud workshop.
        We&rsquo;ll send tracking details as soon as your parcel ships.
      </p>
      <p style="font-size:13px;color:rgba(245,237,209,0.7);font-style:italic;margin-top:24px;">
        Supporting talented family-run craftswomen &amp; craftsmen throughout Bali &amp; Java.
      </p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [opts.to],
      subject: `ZenAura Bali — Order ${opts.orderId} received`,
      html,
    }),
  });
  if (!res.ok) {
    return { sent: false, reason: `resend ${res.status}` };
  }
  return { sent: true };
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret not configured" },
      { status: 400 },
    );
  }

  const body = await req.text();
  let event;
  try {
    const stripe = assertStripe();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    console.error("[stripe-webhook] verification failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid signature" },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as {
        id: string;
        amount_total: number | null;
        currency: string | null;
        customer_details?: { email?: string | null } | null;
      };
      const email = session.customer_details?.email ?? null;
      console.log("[stripe-webhook] checkout.session.completed", {
        id: session.id,
        email,
        amount_total: session.amount_total,
        currency: session.currency,
      });
      if (email && session.amount_total && session.currency) {
        await sendOrderEmail({
          to: email,
          orderId: session.id,
          amountTotal: session.amount_total,
          currency: session.currency,
        });
      }
      break;
    }
    case "payment_intent.succeeded":
      console.log("[stripe-webhook] payment_intent.succeeded", event.data.object);
      break;
    default:
      console.log("[stripe-webhook] unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}
