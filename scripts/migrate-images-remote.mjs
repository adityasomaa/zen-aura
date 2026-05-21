#!/usr/bin/env node
/**
 * Drives the /api/admin/migrate-images route on a deployed Vercel host
 * so uploads run inside Vercel's runtime (where the Blob v2 token is valid).
 *
 * Usage:
 *   ADMIN_SECRET=xxx SITE_URL=https://zen-aura.vercel.app \
 *     node scripts/migrate-images-remote.mjs
 *
 * Or via .env.local:
 *   ADMIN_SECRET=xxx
 *   NEXT_PUBLIC_SITE_URL=https://zen-aura.vercel.app
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_DIR = path.join(ROOT, "src", "content", "products");
const MAP_FILE = path.join(ROOT, "_scrape", "image-url-map.json");

function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}
loadEnv();

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const SITE_URL =
  process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://zen-aura.vercel.app";

if (!ADMIN_SECRET) {
  console.error("ADMIN_SECRET not set in environment / .env.local");
  process.exit(1);
}

const ENDPOINT = `${SITE_URL.replace(/\/$/, "")}/api/admin/migrate-images`;

function existingMap() {
  if (!fs.existsSync(MAP_FILE)) return {};
  return JSON.parse(fs.readFileSync(MAP_FILE, "utf8"));
}
function saveMap(map) {
  fs.mkdirSync(path.dirname(MAP_FILE), { recursive: true });
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2));
}

function blobPathFor(shopifyUrl, productHandle) {
  const u = new URL(shopifyUrl);
  const base = path.basename(u.pathname);
  return `products/${productHandle}/${base}`;
}

function extractAllImages() {
  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".mdx"));
  const items = [];
  for (const f of files) {
    const handle = path.basename(f, path.extname(f));
    const raw = fs.readFileSync(path.join(PRODUCTS_DIR, f), "utf8");
    const matches = [...raw.matchAll(/src:\s*"([^"]+)"/g)];
    for (const m of matches) {
      const url = m[1];
      if (!url.includes("cdn.shopify.com") && !url.includes("myshopify.com")) continue;
      items.push({ handle, shopifyUrl: url, blobPath: blobPathFor(url, handle) });
    }
  }
  // dedupe
  const seen = new Set();
  return items.filter((i) => (seen.has(i.shopifyUrl) ? false : seen.add(i.shopifyUrl)));
}

function rewriteAllMdx(map) {
  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".mdx"));
  let updated = 0;
  for (const f of files) {
    const fp = path.join(PRODUCTS_DIR, f);
    let raw = fs.readFileSync(fp, "utf8");
    const before = raw;
    for (const [from, to] of Object.entries(map)) {
      raw = raw.split(`src: "${from}"`).join(`src: "${to}"`);
    }
    if (raw !== before) {
      fs.writeFileSync(fp, raw, "utf8");
      updated++;
    }
  }
  return updated;
}

async function callBatch(urls) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: ADMIN_SECRET, urls }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  const map = existingMap();
  const items = extractAllImages();
  const pending = items.filter((i) => !map[i.shopifyUrl]);
  console.log(`Total Shopify images: ${items.length}`);
  console.log(`Already mapped:       ${items.length - pending.length}`);
  console.log(`To upload:            ${pending.length}`);
  if (pending.length === 0) {
    const updated = rewriteAllMdx(map);
    console.log(`MDX files updated: ${updated}`);
    return;
  }

  const BATCH = 10;
  let migrated = 0;
  let failed = 0;
  for (let i = 0; i < pending.length; i += BATCH) {
    const batch = pending.slice(i, i + BATCH);
    process.stdout.write(`Batch ${i / BATCH + 1}/${Math.ceil(pending.length / BATCH)} (${batch.length}) ... `);
    try {
      const json = await callBatch(batch);
      for (const [k, v] of Object.entries(json.results)) {
        map[k] = v;
        migrated++;
      }
      for (const [k, err] of Object.entries(json.errors)) {
        console.error(`\n  ! ${k}: ${err}`);
        failed++;
      }
      saveMap(map);
      process.stdout.write(`ok (${Object.keys(json.results).length})\n`);
    } catch (e) {
      console.error(`\n  ! batch failed: ${e.message}`);
      failed += batch.length;
    }
  }
  const updated = rewriteAllMdx(map);
  console.log("");
  console.log(`Uploaded:    ${migrated}`);
  console.log(`Failed:      ${failed}`);
  console.log(`MDX updated: ${updated}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
