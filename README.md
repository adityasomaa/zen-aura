# ZenAura Bali

Custom storefront for **ZenAura Bali** — bohemian fashion, silver jewelry, and
spiritual treasures handcrafted in Ubud, Bali. Migrated from Shopify to a fully
custom stack hosted on Vercel.

## Stack

| Layer | Tool |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first theme tokens) |
| Commerce | Stripe (USD) + Xendit (IDR) |
| Products | MDX files in `src/content/products/` (source of truth) |
| Content | MDX in `src/content/pages/` |
| Images | Vercel Blob (`@vercel/blob`) |
| Email | Resend (transactional + audiences) |
| Motion | GSAP + ScrollTrigger |
| Hosting | Vercel |

## Quick start

```bash
npm install
cp .env.example .env.local      # fill in keys
npm run dev
```

Visit http://localhost:3000.

### Building

```bash
npm run build
npm run start
```

## Project structure

```
src/
  app/                       Next.js App Router pages + API routes
  components/                React components (layout, product, cart, …)
  content/
    products/                One MDX file per product (the catalog)
    pages/                   Long-form pages (about, shipping, terms, …)
  lib/                       Shared utilities (stripe, xendit, currency, …)
scripts/
  migrate-products.mjs       Regenerate product MDX from _scrape/products/catalog.json
_scrape/                     Raw scrape of the legacy Shopify store (gitignored)
```

## Managing the catalog

The catalog is **40 MDX files** under `src/content/products/`. Each file's
frontmatter is the product record (handle, prices, variants, images); the body
is the description in Markdown.

To add a product: copy an existing MDX file, edit the frontmatter and body,
then create the matching Stripe Product in the Stripe Dashboard. Paste the
Stripe Product ID into `stripeProductId` in the frontmatter.

To bulk-regenerate from a fresh Shopify export, drop a new `catalog.json` into
`_scrape/products/` and re-run:

```bash
node scripts/migrate-products.mjs
```

## Deployment

Push to `main` → Vercel auto-deploys. Preview deploys for every branch and PR.

Set these env vars in the Vercel dashboard (see `.env.example` for the full list):

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `XENDIT_SECRET_KEY`, `XENDIT_WEBHOOK_TOKEN`
- `BLOB_READ_WRITE_TOKEN`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

## License

All rights reserved · ZenAura Bali.
