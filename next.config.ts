import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob (production product images)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Shopify CDN (transitional — used while we migrate assets off Shopify)
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Allow our static SVG placeholders (e.g. /placeholders/cosmic.svg).
    // We only ever render SVGs we authored ourselves, so the usual
    // SVG-XSS risk does not apply.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
