import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  getAllCategories,
  getProductsByCategory,
} from "@/lib/products";
import type { Category } from "@/lib/types";

const CATEGORY_COPY: Record<Category, { title: string; lede: string }> = {
  fashion: {
    title: "Fashion",
    lede: "Halter dresses, drapes, festival hats — soft natural fibres, hand-finished in Ubud.",
  },
  jewelry: {
    title: "Jewelry",
    lede: "Silver adornments and spiritual amulets, made with intention.",
  },
  interiors: {
    title: "Interiors",
    lede: "Lighting, painted decor, and ritual objects for sacred everyday spaces.",
  },
};

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
  return {
    title: CATEGORY_COPY[cat].title,
    description: CATEGORY_COPY[cat].lede,
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
    <section className="container-wide py-16">
      <header className="mb-12">
        <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-3">
          Collection
        </div>
        <h1 className="font-display text-5xl md:text-7xl tracking-tight">
          {copy.title}
        </h1>
        <p className="mt-4 text-ink-soft max-w-xl">{copy.lede}</p>
        <p className="mt-2 text-xs text-ink-muted">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>
      </header>
      <ProductGrid products={products} />
    </section>
  );
}
