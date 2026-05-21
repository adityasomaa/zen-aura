import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

/**
 * One-shot migration helper, used by scripts/migrate-images-remote.mjs.
 * POST with `{ secret, urls: [{shopifyUrl, blobPath}] }`. Returns a mapping.
 *
 * This route is only useful during the Shopify→Blob image migration.
 * Protect with an `ADMIN_SECRET` env var set in Vercel.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

interface Item {
  shopifyUrl: string;
  blobPath: string;
}

interface Body {
  secret: string;
  urls: Item[];
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || body.secret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!Array.isArray(body.urls) || body.urls.length === 0) {
    return NextResponse.json({ error: "urls required" }, { status: 400 });
  }

  if (body.urls.length > 25) {
    return NextResponse.json(
      { error: "max 25 urls per call" },
      { status: 400 },
    );
  }

  // Cache existing blobs once per call so we can dedupe
  const existing = new Map<string, string>();
  try {
    let cursor: string | undefined;
    do {
      const page = await list({ cursor, limit: 1000 });
      for (const b of page.blobs) existing.set(b.pathname, b.url);
      cursor = page.cursor;
    } while (cursor);
  } catch {
    /* noop */
  }

  const results: Record<string, string> = {};
  const errors: Record<string, string> = {};

  for (const item of body.urls) {
    try {
      if (existing.has(item.blobPath)) {
        results[item.shopifyUrl] = existing.get(item.blobPath)!;
        continue;
      }
      const src = item.shopifyUrl.startsWith("//")
        ? "https:" + item.shopifyUrl
        : item.shopifyUrl;
      const res = await fetch(src);
      if (!res.ok) {
        errors[item.shopifyUrl] = `fetch ${res.status}`;
        continue;
      }
      const bytes = Buffer.from(await res.arrayBuffer());
      const contentType =
        res.headers.get("content-type") ??
        (item.shopifyUrl.endsWith(".png") ? "image/png" : "image/jpeg");
      const r = await put(item.blobPath, bytes, {
        access: "public",
        contentType,
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      results[item.shopifyUrl] = r.url;
    } catch (e) {
      errors[item.shopifyUrl] = e instanceof Error ? e.message : "unknown";
    }
  }

  return NextResponse.json({ results, errors });
}
