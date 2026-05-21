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
}

export function ProductGrid({ products, priorityCount = 4 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>(".product-card-wrap");
      gsap.set(cards, { autoAlpha: 0, y: 32 });
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
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
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 md:gap-x-7 gap-y-12"
    >
      {products.map((p, i) => (
        <div key={p.handle} className="product-card-wrap">
          <ProductCard product={p} priority={i < priorityCount} />
        </div>
      ))}
    </div>
  );
}
