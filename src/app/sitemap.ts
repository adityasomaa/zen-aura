import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://zen-aura.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const products = getAllProducts();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${BASE_URL}/shop/fashion`, changeFrequency: "daily", priority: 0.85, lastModified: now },
    { url: `${BASE_URL}/shop/jewelry`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${BASE_URL}/shop/interiors`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${BASE_URL}/meet-the-creators`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${BASE_URL}/shipping`, changeFrequency: "yearly", priority: 0.5, lastModified: now },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
  ];

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.handle}`,
    lastModified: p.createdAt ? new Date(p.createdAt) : now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticEntries, ...productEntries];
}
