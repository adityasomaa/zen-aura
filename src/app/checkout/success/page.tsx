"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

export default function SuccessPage() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <section className="container-narrow py-24 md:py-32 text-center">
      <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-6">
        Order received
      </div>
      <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
        Thank you.
      </h1>
      <p className="mt-8 text-lg text-ink-soft max-w-xl mx-auto leading-relaxed">
        Your order is on its way through the Ubud workshop. You&rsquo;ll receive a
        confirmation email shortly, and tracking details once your parcel ships.
      </p>
      <Link
        href="/shop"
        className="mt-12 inline-flex items-center bg-ink text-paper px-6 py-3 text-sm uppercase tracking-widest hover:bg-terracotta transition-colors"
      >
        Keep browsing
      </Link>
    </section>
  );
}
