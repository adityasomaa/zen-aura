#!/usr/bin/env node
/**
 * Uploads every product image referenced from src/content/products/*.mdx
 * (and the brand logo) into Vercel Blob, then rewrites the MDX files
 * to point at the new blob URLs.
 *
 * Idempotent: re-running skips images already present in the blob store.
 *
 * Run:
 *   - Requires BLOB_READ_WRITE_TOKEN in .env.local
 *   - node scripts/migrate-images.mjs
 *
 * Result:
 *   - All image src URLs in src/content/products/*.mdx rewritten
 *   - public/brand/logo-blob-url.txt written (logo URL for header reuse)
 *   - _scrape/image-url-map.json updated (shopify-url → blob-url)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { list, put } from "@vercel/blob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_DIR = path.join(ROOT, "src", "content", "products");
const SCRAPE_DIR = path.join(ROOT, "_scrape");
const MAP_FILE = path.join(SCRAPE_DIR, "image-url-map.json");

// Load token from .env.local manually (no dotenv dep).
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

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN missing from environment.");
  process.exit(1);
}

const token = process.env.BLOB_READ_WRITE_TOKEN;

function existingMap() {
  if (!fs.existsSync(MAP_FILE)) return {};
  return JSON.parse(fs.readFileSync(MAP_FILE, "utf8"));
}

function saveMap(map) {
  fs.mkdirSync(SCRAPE_DIR, { recursive: true });
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2));
}

/** Build a stable Blob pathname for a given Shopify URL. */
function blobPathFor(shopifyUrl, productHandle) {
  const u = new URL(shopifyUrl);
  const base = path.basename(u.pathname);
  return `products/${productHandle}/${base}`;
}

function extractMdxImages(filePath, handle) {
  const raw = fs.readFileSync(filePath, "utf8");
  const matches = [...raw.matchAll(/src:\s*"([^"]+)"/g)];
  return matches.map((m) => ({
    raw: m[0],
    url: m[1],
    handle,
  }));
}

function rewriteMdx(filePath, replacements) {
  let raw = fs.readFileSync(filePath, "utf8");
  for (const [from, to] of replacements) {
    raw = raw.split(from).join(to);
  }
  fs.writeFileSync(filePath, raw, "utf8");
}

async function fetchBytes(url) {
  // Shopify CDN URLs use protocol-relative form occasionally.
  const fullUrl = url.startsWith("//") ? "https:" + url : url;
  const res = await fetch(fullUrl);
  if (!res.ok) throw new Error(`fetch failed ${res.status} ${fullUrl}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const map = existingMap();

  // Inventory already-uploaded blobs so we can skip
  const known = new Map(); // blobPath -> url
  try {
    let cursor;
    do {
      const page = await list({ token, cursor, limit: 1000 });
      for (const b of page.blobs) known.set(b.pathname, b.url);
      cursor = page.cursor;
    } while (cursor);
  } catch (e) {
    console.warn("Could not list existing blobs:", e.message);
  }
  console.log(`Already in blob store: ${known.size} files`);

  const files = fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  let mdxUpdated = 0;

  for (const file of files) {
    const handle = path.basename(file, path.extname(file));
    const filePath = path.join(PRODUCTS_DIR, file);
    const images = extractMdxImages(filePath, handle);
    if (images.length === 0) continue;

    const replacements = [];

    for (const img of images) {
      if (!img.url.includes("cdn.shopify.com") && !img.url.includes("myshopify.com")) {
        // Already migrated or external — leave alone
        continue;
      }
      if (map[img.url]) {
        replacements.push([`src: "${img.url}"`, `src: "${map[img.url]}"`]);
        skipped++;
        continue;
      }

      const blobPath = blobPathFor(img.url, handle);
      if (known.has(blobPath)) {
        const blobUrl = known.get(blobPath);
        map[img.url] = blobUrl;
        replacements.push([`src: "${img.url}"`, `src: "${blobUrl}"`]);
        skipped++;
        continue;
      }

      try {
        const bytes = await fetchBytes(img.url);
        const result = await put(blobPath, bytes, {
          access: "public",
          token,
          contentType: img.url.endsWith(".png")
            ? "image/png"
            : img.url.endsWith(".webp")
              ? "image/webp"
              : "image/jpeg",
          addRandomSuffix: false,
          allowOverwrite: true,
        });
        map[img.url] = result.url;
        known.set(blobPath, result.url);
        replacements.push([`src: "${img.url}"`, `src: "${result.url}"`]);
        migrated++;
        process.stdout.write(`  + ${blobPath}\n`);
      } catch (e) {
        console.error(`  ! ${img.url} → ${e.message}`);
        failed++;
      }
    }

    if (replacements.length > 0) {
      rewriteMdx(filePath, replacements);
      mdxUpdated++;
    }
  }

  saveMap(map);
  console.log("");
  console.log(`Migrated:    ${migrated}`);
  console.log(`Skipped:     ${skipped}`);
  console.log(`Failed:      ${failed}`);
  console.log(`MDX updated: ${mdxUpdated}`);
  console.log(`Map saved to ${path.relative(ROOT, MAP_FILE)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
