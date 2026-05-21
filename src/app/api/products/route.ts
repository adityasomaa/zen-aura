import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

// Lightweight read-only catalog endpoint for the client cart.
// Only includes fields the cart actually needs (no raw description).
export async function GET() {
  const products = getAllProducts().map((p) => ({
    handle: p.handle,
    title: p.title,
    subtitle: p.subtitle,
    category: p.category,
    priceUsd: p.priceUsd,
    priceIdr: p.priceIdr,
    variants: p.variants,
    images: p.images.slice(0, 1),
  }));
  return NextResponse.json(products, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
