import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { put } from "@vercel/blob";

/**
 * Captures the welcome-popup subscriber.
 *
 *  Body: { channel: "whatsapp" | "email", value: string }
 *
 * Behaviour:
 *  - Validates the input.
 *  - Persists one JSON blob per subscriber under `subscribers/`.
 *  - If RESEND_API_KEY is configured, fires off a welcome email via Resend.
 *    Otherwise just logs to console and returns success — the popup still
 *    finishes its flow so the demo works end-to-end.
 *
 *  Returns: { ok: true, code: "ZENWELCOME10" }
 */

export const runtime = "nodejs";

interface Body {
  channel: "whatsapp" | "email";
  value: string;
}

const WELCOME_CODE = "ZENWELCOME10";

function sha8(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 8);
}

async function persistSubscriber(payload: Record<string, unknown>) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const key = `subscribers/${Date.now()}-${sha8(String(payload.value))}.json`;
  try {
    const result = await put(key, JSON.stringify(payload, null, 2), {
      access: "public",
      contentType: "application/json",
      token,
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    return result.url;
  } catch (e) {
    console.warn("subscribers blob write failed:", e);
    return null;
  }
}

async function sendWelcomeEmail(email: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "ZenAura Bali <hello@zenaura-bali.com>";
  if (!key) return { sent: false, reason: "RESEND_API_KEY not set" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Your 10% off — welcome to ZenAura",
        html: welcomeHtml(WELCOME_CODE),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { sent: false, reason: `resend ${res.status}: ${text}` };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "unknown" };
  }
}

function welcomeHtml(code: string) {
  return `
  <div style="font-family:Georgia,serif;background:#301934;color:#f5edd1;padding:40px;border-radius:20px;max-width:560px;margin:auto;">
    <div style="text-align:center;color:#eed977;font-size:14px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:24px;">ZenAura · Bali</div>
    <h1 style="font-family:Georgia,serif;color:#f5edd1;font-size:34px;line-height:1.15;margin:0 0 14px 0;font-weight:400;">
      <em style="color:#eed977;">10% off</em> your first treasure.
    </h1>
    <p style="font-size:15px;line-height:1.6;color:rgba(245,237,209,0.85);margin:0 0 22px 0;">
      Use the code below at checkout. And — enjoy an additional 15% when your basket reaches $195 / £145.
    </p>
    <div style="background:#1a0b1e;border:1px solid #4a2a52;border-radius:14px;padding:18px;text-align:center;margin:28px 0;">
      <div style="font-size:11px;letter-spacing:0.32em;color:#eed977;text-transform:uppercase;margin-bottom:8px;">Welcome code</div>
      <div style="font-family:Georgia,serif;font-size:30px;color:#f5edd1;letter-spacing:0.08em;">${code}</div>
    </div>
    <p style="font-size:13px;line-height:1.6;color:rgba(245,237,209,0.65);margin:24px 0 0 0;font-style:italic;">
      Supporting talented family-run craftswomen &amp; craftsmen throughout Bali &amp; Java.
    </p>
  </div>`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const value = (body.value ?? "").trim();
  if (!value) {
    return NextResponse.json({ error: "Value is required" }, { status: 400 });
  }
  if (body.channel !== "whatsapp" && body.channel !== "email") {
    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  }
  if (body.channel === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (body.channel === "whatsapp") {
    const digits = value.replace(/[^\d]/g, "");
    if (digits.length < 8) {
      return NextResponse.json(
        { error: "Invalid WhatsApp number" },
        { status: 400 },
      );
    }
  }

  const payload = {
    channel: body.channel,
    value,
    code: WELCOME_CODE,
    createdAt: new Date().toISOString(),
    ua: req.headers.get("user-agent") ?? "",
    ip: req.headers.get("x-forwarded-for") ?? "",
  };

  const blobUrl = await persistSubscriber(payload);
  let emailResult: { sent: boolean; reason?: string } | null = null;
  if (body.channel === "email") {
    emailResult = await sendWelcomeEmail(value);
  }

  console.log("[newsletter] subscriber", {
    channel: body.channel,
    value,
    blobUrl,
    emailResult,
  });

  return NextResponse.json({
    ok: true,
    code: WELCOME_CODE,
    persisted: !!blobUrl,
    emailed: emailResult?.sent ?? false,
  });
}
