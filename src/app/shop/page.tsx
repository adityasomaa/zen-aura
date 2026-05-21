import { ProductGrid } from "@/components/product/ProductGrid";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Shop",
  description: "All handcrafted treasures from ZenAura Bali.",
};

export default function ShopPage() {
  const products = getAllProducts();
  return (
    <section className="container-wide py-16">
      <header className="mb-12">
        <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-3">
          The full collection
        </div>
        <h1 className="font-display text-5xl md:text-7xl tracking-tight">
          Shop
        </h1>
        <p className="mt-4 text-ink-soft max-w-xl">
          {products.length} pieces, handcrafted in Ubud.
        </p>
      </header>
      <ProductGrid products={products} />
    </section>
  );
}
