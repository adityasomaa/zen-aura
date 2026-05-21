"use client";

import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/currency";

interface Props {
  priceUsd: number;
  priceIdr: number;
}

export function ProductCardPrice({ priceUsd, priceIdr }: Props) {
  const currency = useCart((s) => s.currency);
  const value = currency === "USD" ? priceUsd : priceIdr;
  return (
    <span className="text-base shrink-0 text-gold tabular-nums">
      {formatPrice(value, currency)}
    </span>
  );
}
