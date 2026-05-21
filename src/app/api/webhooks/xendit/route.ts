import { NextResponse } from "next/server";

/**
 * Xendit invoice webhook.
 *
 * Verification: Xendit sends `x-callback-token` header which must match
 * XENDIT_WEBHOOK_TOKEN configured in Vercel env.
 *
 * Configure once in Xendit Dashboard → Settings → Webhooks:
 *   Invoice paid URL: https://zen-aura.vercel.app/api/webhooks/xendit
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "ZenAura Bali <orders@zenaura-bali.com>";

async function sendOrderEmail(opts: {
  to: string;
  externalId: string;
  amountIdr: number;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY not set" };
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(opts.amountIdr);
  const html = `
    <div style="font-family:Georgia,serif;background:#301934;color:#f5edd1;padding:40px;border-radius:20px;max-width:560px;margin:auto;">
      <div style="text-align:center;color:#eed977;font-size:14px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:24px;">ZenAura · Bali</div>
      <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.15;margin:0 0 14px 0;font-weight:400;">Terima kasih atas pesanan Anda.</h1>
      <p style="font-size:15px;line-height:1.6;color:rgba(245,237,209,0.85);">
        Pesanan <strong>${opts.externalId}</strong> sebesar ${formatted} sedang kami siapkan di workshop Ubud.
        Detail pengiriman akan kami kirim begitu paket Anda dikirim.
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
      subject: `ZenAura Bali — Order ${opts.externalId} diterima`,
      html,
    }),
  });
  return res.ok ? { sent: true } : { sent: false, reason: `resend ${res.status}` };
}

export async function POST(req: Request) {
  const token = req.headers.get("x-callback-token");
  const expected = process.env.XENDIT_WEBHOOK_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = String(payload.status ?? "");
  const externalId = String(payload.external_id ?? "");
  const amount = Number(payload.amount ?? 0);
  const email = String(payload.payer_email ?? "");

  console.log("[xendit-webhook]", { status, externalId, amount, email });

  if (status === "PAID" && email && amount > 0) {
    await sendOrderEmail({ to: email, externalId, amountIdr: amount });
  }

  return NextResponse.json({ received: true });
}
