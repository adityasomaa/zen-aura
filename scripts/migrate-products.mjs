#!/usr/bin/env node
/**
 * Converts the scraped Shopify catalog (_scrape/products/catalog.json) into
 * one MDX file per product under src/content/products/.
 *
 * Run:  node scripts/migrate-products.mjs
 *
 * Conservative: we keep handle/title/images/variants. body_html is converted
 * to lightly-cleaned markdown. Prices are read from the first variant.
 * Re-running overwrites existing files — edit src/content/products/*.mdx
 * after migration and commit those edits.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CATALOG = path.join(ROOT, "_scrape", "products", "catalog.json");
const OUT_DIR = path.join(ROOT, "src", "content", "products");

const FALLBACK_USD_TO_IDR = 16000;

/** Guess category from product_type / title / tags */
function inferCategory(p) {
  const t = (p.product_type ?? "").toLowerCase();
  const title = (p.title ?? "").toLowerCase();
  if (t.includes("jewel") || /silver|amulet|ring|necklace|earring/.test(title)) return "jewelry";
  if (t.includes("interior") || /lighting|decor|handle|painted|home/.test(title)) return "interiors";
  return "fashion";
}

/** Pull primary color descriptor from title */
function extractSubtitle(title) {
  // Take text after the last separator (🪬, ~, |) if present
  const parts = title.split(/[~|·]/);
  return parts.length > 1 ? parts[parts.length - 1].trim().replace(/^[^a-zA-Z0-9]+/, "") : undefined;
}

/** Cheap HTML → markdown (paragraphs + line breaks only). */
function htmlToMarkdown(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<\/?p[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Normalize handle — strip Shopify "-copy" suffix and lowercase. */
function normalizeHandle(handle) {
  return handle.replace(/-copy(\d*)$/i, "").toLowerCase();
}

/** YAML-safe quoted string */
function yamlStr(s) {
  if (s == null) return '""';
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function toFrontmatter(p) {
  const category = inferCategory(p);
  const subtitle = extractSubtitle(p.title);
  const v0 = p.variants?.[0] ?? {};
  const priceUsd = Number(v0.price ?? 0) || 0;
  const priceIdr = Math.round(priceUsd * FALLBACK_USD_TO_IDR);

  // Variants: if there are real options (not just "Default Title"), keep them.
  const realVariants = (p.variants ?? []).filter(
    (v) => (v.title && v.title !== "Default Title") || v.sku,
  );
  const variants = realVariants.length
    ? realVariants.map((v, i) => ({
        id: (v.title ?? `variant-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: v.title ?? `Variant ${i + 1}`,
        inStock: !!v.available,
        priceUsdOverride: Number(v.price) !== priceUsd ? Number(v.price) : undefined,
      }))
    : [{ id: "default", label: "One Size", inStock: !!v0.available }];

  const images = (p.images ?? []).map((src, i) => ({
    src,
    alt: `${p.title} — ${i + 1}`,
  }));

  const lines = [
    "---",
    `handle: ${yamlStr(normalizeHandle(p.handle))}`,
    `title: ${yamlStr(p.title)}`,
    subtitle ? `subtitle: ${yamlStr(subtitle)}` : null,
    `category: ${category}`,
    `priceUsd: ${priceUsd}`,
    `priceIdr: ${priceIdr}`,
    `published: ${priceUsd > 0}`,
    `featured: false`,
    `createdAt: ${yamlStr(p.created_at ?? new Date().toISOString())}`,
    "variants:",
    ...variants.map((v) => {
      const parts = [
        `  - id: ${yamlStr(v.id)}`,
        `    label: ${yamlStr(v.label)}`,
        `    inStock: ${v.inStock}`,
      ];
      if (v.priceUsdOverride != null) parts.push(`    priceUsdOverride: ${v.priceUsdOverride}`);
      return parts.join("\n");
    }),
    "images:",
    ...images.map(
      (img) => `  - src: ${yamlStr(img.src)}\n    alt: ${yamlStr(img.alt)}`,
    ),
    "---",
    "",
    htmlToMarkdown(p.body_html),
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return lines;
}

function main() {
  if (!fs.existsSync(CATALOG)) {
    console.error(`catalog.json not found at ${CATALOG}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const products = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
  let written = 0;
  let skipped = 0;
  for (const p of products) {
    const handle = normalizeHandle(p.handle);
    if (!handle) {
      skipped++;
      continue;
    }
    const mdx = toFrontmatter(p);
    fs.writeFileSync(path.join(OUT_DIR, `${handle}.mdx`), mdx, "utf8");
    written++;
  }
  console.log(`Wrote ${written} product MDX files to ${path.relative(ROOT, OUT_DIR)} (skipped ${skipped})`);
}

main();
