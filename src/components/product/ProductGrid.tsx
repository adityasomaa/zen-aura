import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  priorityCount?: number;
}

export function ProductGrid({ products, priorityCount = 4 }: Props) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-ink-muted">
        No products yet — check back soon.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((p, i) => (
        <ProductCard key={p.handle} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
