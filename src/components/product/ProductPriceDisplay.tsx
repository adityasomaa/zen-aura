"use client";

import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/currency";

interface Props {
  priceUsd: number;
  priceIdr: number;
  compareAtUsd?: number;
}

export function ProductPriceDisplay({ priceUsd, priceIdr, compareAtUsd }: Props) {
  const currency = useCart((s) => s.currency);
  const primary = currency === "USD" ? priceUsd : priceIdr;
  const secondary = currency === "USD" ? priceIdr : priceUsd;
  const secondaryCurrency = currency === "USD" ? "IDR" : "USD";

  return (
    <div className="mt-6 flex items-baseline gap-3">
      <div className="text-3xl tabular-nums text-gold">
        {formatPrice(primary, currency)}
      </div>
      <div className="text-sm text-cream-deep tabular-nums">
        {formatPrice(secondary, secondaryCurrency)}
      </div>
      {compareAtUsd && compareAtUsd > priceUsd && (
        <div className="text-sm text-cream-deep/60 line-through">
          {formatPrice(currency === "USD" ? compareAtUsd : compareAtUsd * 16000, currency)}
        </div>
      )}
    </div>
  );
}
