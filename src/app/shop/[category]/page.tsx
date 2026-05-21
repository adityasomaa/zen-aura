import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  getAllCategories,
  getProductsByCategory,
} from "@/lib/products";
import type { Category } from "@/lib/types";

const CATEGORY_COPY: Record<
  Category,
  { eyebrow: string; title: string; suffix: string; lede: string }
> = {
  fashion: {
    eyebrow: "Alternative Attire",
    title: "Natural Fibres & Festival Fashion",
    suffix: "Handmade in Ubud, Bali",
    lede: "Soft-touch viscose, halter dresses, drapes, festival hats — each piece carries the breath of its maker.",
  },
  jewelry: {
    eyebrow: "Bijoux Jewelry",
    title: "Unique Crystal Designs",
    suffix: "Handmade in Amed, East Bali",
    lede: "Silver adornments and spiritual amulets, hand-forged in the volcanic east of the island.",
  },
  interiors: {
    eyebrow: "Authentic Interiors",
    title: "Bohemian Décor & Sacred Trinkets",
    suffix: "Handmade across Bali",
    lede: "Lighting, painted decor, and ritual objects for sacred everyday spaces.",
  },
};

const BRAND_MOTTO =
  "Supporting talented family-run craftswomen & craftsmen throughout Bali & Java.";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = category as Category;
  if (!CATEGORY_COPY[cat]) return {};
  const copy = CATEGORY_COPY[cat];
  return {
    title: `${copy.eyebrow} — ${copy.title}`,
    description: copy.lede,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = category as Category;
  const copy = CATEGORY_COPY[cat];
  if (!copy) notFound();

  const products = getProductsByCategory(cat);

  return (
    <section className="container-wide py-16 md:py-20">
      <header className="mb-12 md:mb-16 max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-3 flex items-center gap-3">
          <span className="w-8 h-px bg-gold/40" />
          {copy.eyebrow}
        </div>
        <h1 className="font-display text-cream text-4xl md:text-6xl tracking-tight leading-[1.02]">
          <em className="italic text-gold">~</em> {copy.title}{" "}
          <em className="italic text-gold">~</em>
        </h1>
        <div className="mt-3 text-base text-cream-deep">
          {copy.suffix}
        </div>
        <p className="mt-5 italic text-cream-deep/80 text-[15px] max-w-xl">
          {BRAND_MOTTO}
        </p>
        <p className="mt-6 text-cream-deep/90 max-w-xl">
          {copy.lede}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gold/60">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>
      </header>
      <ProductGrid products={products} columns={4} size="md" />
    </section>
  );
}
