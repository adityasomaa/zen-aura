"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatPrice, usdToIdr } from "@/lib/currency";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const currency = useCart((s) => s.currency);
  const hydrated = useCart((s) => s.hydrated);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeLine = useCart((s) => s.removeLine);

  const [catalog, setCatalog] = useState<Record<string, Product> | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const map: Record<string, Product> = {};
        for (const p of data) map[p.handle] = p;
        setCatalog(map);
      })
      .catch(() => setCatalog({}));
  }, []);

  const enriched = useMemo(() => {
    if (!catalog) return [];
    return lines
      .map((line) => {
        const product = catalog[line.productHandle];
        if (!product) return null;
        const variant = product.variants.find((v) => v.id === line.variantId);
        return { line, product, variant };
      })
      .filter(Boolean) as {
      line: typeof lines[number];
      product: Product;
      variant: Product["variants"][number] | undefined;
    }[];
  }, [lines, catalog]);

  const totals = useMemo(() => {
    let usd = 0;
    let idr = 0;
    for (const e of enriched) {
      usd += e.product.priceUsd * e.line.quantity;
      idr += e.product.priceIdr * e.line.quantity;
    }
    return { usd, idr };
  }, [enriched]);

  async function checkout() {
    setCheckingOut(true);
    setError(null);
    try {
      const endpoint =
        currency === "USD" ? "/api/checkout/stripe" : "/api/checkout/xendit";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setCheckingOut(false);
    }
  }

  if (!hydrated || catalog === null) {
    return (
      <section className="container-narrow py-24">
        <h1 className="font-display text-5xl md:text-6xl tracking-tight">Cart</h1>
        <div className="mt-8 text-ink-muted">Loading…</div>
      </section>
    );
  }

  if (enriched.length === 0) {
    return (
      <section className="container-narrow py-24 text-center">
        <h1 className="font-display text-5xl md:text-6xl tracking-tight">
          Your cart is empty
        </h1>
        <p className="mt-4 text-ink-soft">
          Nothing here yet. Wander the collection.
        </p>
        <Link href="/shop" className="mt-10 btn-gold">
          Browse the shop
        </Link>
      </section>
    );
  }

  return (
    <section className="container-wide py-16 grid lg:grid-cols-[1fr_360px] gap-16">
      <div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-10">
          Cart
        </h1>
        <ul className="divide-y divide-line">
          {enriched.map(({ line, product, variant }) => {
            const cover = product.images[0];
            const priceUsd = product.priceUsd * line.quantity;
            const priceIdr = product.priceIdr * line.quantity;
            const cleanTitle = product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();
            return (
              <li
                key={`${line.productHandle}-${line.variantId}`}
                className="py-6 grid grid-cols-[100px_1fr_auto] gap-5 items-start"
              >
                <Link
                  href={`/products/${product.handle}`}
                  className="relative aspect-[3/4] bg-paper-deep/40 border border-line overflow-hidden"
                >
                  {cover && (
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="min-w-0">
                  <Link
                    href={`/products/${product.handle}`}
                    className="font-display text-xl hover:text-terracotta transition-colors"
                  >
                    {cleanTitle}
                  </Link>
                  {variant && variant.id !== "default" && (
                    <div className="text-xs text-ink-muted mt-1">
                      {variant.label}
                    </div>
                  )}
                  <div className="mt-3 inline-flex items-center border border-line">
                    <button
                      onClick={() =>
                        setQuantity(
                          line.productHandle,
                          line.variantId,
                          line.quantity - 1,
                        )
                      }
                      className="px-3 py-1 text-ink-soft hover:text-ink"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          line.productHandle,
                          line.variantId,
                          line.quantity + 1,
                        )
                      }
                      className="px-3 py-1 text-ink-soft hover:text-ink"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeLine(line.productHandle, line.variantId)}
                    className="ml-4 text-xs text-ink-muted hover:text-terracotta uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-right text-sm tabular-nums whitespace-nowrap">
                  <div>{formatPrice(currency === "USD" ? priceUsd : priceIdr, currency)}</div>
                  <div className="text-ink-muted text-xs mt-1">
                    {formatPrice(
                      currency === "USD" ? priceIdr : priceUsd,
                      currency === "USD" ? "IDR" : "USD",
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-line bg-paper p-6">
          <div className="text-xs uppercase tracking-widest text-ink-muted mb-4">
            Summary
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span className="tabular-nums">
                {formatPrice(currency === "USD" ? totals.usd : totals.idr, currency)}
              </span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="rule mt-6 pt-4 flex justify-between text-lg">
            <span className="font-display">Total</span>
            <span className="tabular-nums">
              {formatPrice(currency === "USD" ? totals.usd : totals.idr, currency)}
            </span>
          </div>

          <button
            onClick={checkout}
            disabled={checkingOut}
            className={cn(
              "mt-6 w-full rounded-full bg-gold text-midnight py-4 text-base tracking-widest transition-all duration-300 disabled:opacity-50",
              "hover:bg-gold-bright hover:-translate-y-0.5",
            )}
          >
            {checkingOut
              ? "Redirecting…"
              : currency === "USD"
                ? "Checkout with Stripe"
                : "Checkout with Xendit"}
          </button>

          {error && (
            <div className="mt-3 text-xs text-terracotta">{error}</div>
          )}

          <div className="mt-4 text-xs text-ink-muted leading-relaxed">
            {currency === "USD"
              ? "Secure payment by Stripe · Cards, Apple Pay, Google Pay."
              : "Pembayaran via Xendit · QRIS, GoPay, OVO, virtual account, kartu kredit."}
          </div>
        </div>
      </aside>
    </section>
  );
}
