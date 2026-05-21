/**
 * Core domain types for ZenAura.
 * Products live as MDX files in src/content/products/*.mdx with this frontmatter shape.
 */

export type Category = "fashion" | "jewelry" | "interiors";

export type Currency = "USD" | "IDR";

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  /** Stable id, e.g. "size-s-m". Used by cart + Stripe metadata. */
  id: string;
  /** Display label, e.g. "S-M (6-10)" */
  label: string;
  /** Optional per-variant price override in USD cents */
  priceUsdOverride?: number;
  /** Optional per-variant price override in IDR */
  priceIdrOverride?: number;
  inStock: boolean;
}

export interface Product {
  /** URL slug, e.g. "halter-dress-jungle-teal" */
  handle: string;
  title: string;
  /** Short tag line shown under title */
  subtitle?: string;
  category: Category;
  /** Price in USD (whole dollars, e.g. 58) */
  priceUsd: number;
  /** Price in IDR (whole rupiah, e.g. 985000) */
  priceIdr: number;
  /** Compare-at / strikethrough price in USD (optional) */
  compareAtUsd?: number;
  description: string;
  /** Marketing bullet points */
  features?: string[];
  material?: string;
  origin?: string;
  variants: ProductVariant[];
  images: ProductImage[];
  /** Featured on homepage? */
  featured?: boolean;
  /** Tags for filtering (e.g. "handmade", "bohemian") */
  tags?: string[];
  /** Stripe Product ID, populated by sync script */
  stripeProductId?: string;
  /** Whether the product is publicly visible */
  published: boolean;
  createdAt: string;
}

export interface CartLine {
  productHandle: string;
  variantId: string;
  quantity: number;
}

export interface Cart {
  lines: CartLine[];
  /** ISO timestamp */
  updatedAt: string;
}
