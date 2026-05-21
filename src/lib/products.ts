import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Product, Category } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "products");

let cache: Product[] | null = null;

function loadAll(): Product[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) {
    cache = [];
    return cache;
  }
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const products: Product[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      ...(data as Omit<Product, "description">),
      description: content.trim(),
    } as Product;
  });
  cache = products
    .filter((p) => p.published !== false)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return cache;
}

export function getAllProducts(): Product[] {
  return loadAll();
}

export function getProductByHandle(handle: string): Product | undefined {
  return loadAll().find((p) => p.handle === handle);
}

export function getProductsByCategory(category: Category): Product[] {
  return loadAll().filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return loadAll().filter((p) => p.featured).slice(0, limit);
}

export function getAllCategories(): Category[] {
  return ["fashion", "jewelry", "interiors"];
}
