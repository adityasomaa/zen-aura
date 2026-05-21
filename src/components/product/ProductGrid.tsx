"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  products: Product[];
  priorityCount?: number;
  columns?: 3 | 4 | 5;
  size?: "sm" | "md" | "lg";
}

const COL_CLASS = {
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
};

export function ProductGrid({
  products,
  priorityCount = 4,
  columns = 4,
  size = "md",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>(".product-card-wrap");
      gsap.set(cards, { autoAlpha: 0, y: 24 });
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    }, el);
    return () => ctx.revert();
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-cream-deep">
        No products yet — check back soon.
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={`grid ${COL_CLASS[columns]} gap-x-4 md:gap-x-5 gap-y-9`}
    >
      {products.map((p, i) => (
        <div key={p.handle} className="product-card-wrap">
          <ProductCard product={p} priority={i < priorityCount} size={size} />
        </div>
      ))}
    </div>
  );
}
