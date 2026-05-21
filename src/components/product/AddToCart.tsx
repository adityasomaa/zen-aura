"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  product: Product;
}

export function AddToCart({ product }: Props) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "default");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const addLine = useCart((s) => s.addLine);

  const variant = product.variants.find((v) => v.id === variantId);
  const disabled = !variant?.inStock;

  function add() {
    if (disabled) return;
    setAdding(true);
    addLine({ productHandle: product.handle, variantId, quantity: 1 });
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }, 200);
  }

  return (
    <>
      {product.variants.length > 1 && (
        <div className="mt-8">
          <div className="text-xs uppercase tracking-widest text-gold/70 mb-3">
            Variant
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                disabled={!v.inStock}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  variantId === v.id
                    ? "border-gold bg-gold text-midnight"
                    : "border-gold/40 text-cream hover:border-gold",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={add}
        disabled={disabled || adding}
        className={cn(
          "mt-10 w-full rounded-full py-4 text-base tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed",
          added
            ? "bg-sage text-midnight"
            : "bg-gold text-midnight hover:bg-gold-bright hover:-translate-y-0.5",
        )}
      >
        {disabled
          ? "Sold out"
          : added
            ? "✓ Added to cart"
            : adding
              ? "Adding…"
              : "Add to cart"}
      </button>
    </>
  );
}
