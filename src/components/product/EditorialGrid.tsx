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
}

/**
 * Asymmetric bento grid for featured products.
 * Layout: 12-col, first card tall (col-span 5, row-span 2),
 * then 4 cards (col-span 7 split into 3+4 / 4+3, plus 2 more wide).
 *
 * Falls back gracefully if fewer than 5 products are passed.
 */
export function EditorialGrid({ products }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const items = ref.current!.querySelectorAll<HTMLElement>(".eg-cell");
      gsap.set(items, { autoAlpha: 0, y: 40 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [products]);

  const [p0, p1, p2, p3, p4] = products;
  if (!p0) return null;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6"
    >
      <div className="eg-cell md:col-span-5 md:row-span-2">
        {p0 && <ProductCard product={p0} aspect="aspect-[4/5] md:aspect-[3/5]" priority />}
      </div>
      <div className="eg-cell md:col-span-4">
        {p1 && <ProductCard product={p1} aspect="aspect-[5/4]" />}
      </div>
      <div className="eg-cell md:col-span-3">
        {p2 && <ProductCard product={p2} aspect="aspect-[5/4]" />}
      </div>
      <div className="eg-cell md:col-span-3">
        {p3 && <ProductCard product={p3} aspect="aspect-[5/4]" />}
      </div>
      <div className="eg-cell md:col-span-4">
        {p4 && <ProductCard product={p4} aspect="aspect-[5/4]" />}
      </div>
    </div>
  );
}
