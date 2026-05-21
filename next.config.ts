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
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
