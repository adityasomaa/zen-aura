"use client";

import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

export function CurrencySwitcher() {
  const currency = useCart((s) => s.currency);
  const setCurrency = useCart((s) => s.setCurrency);

  return (
    <div className="inline-flex rounded-full border border-gold/40 overflow-hidden text-xs">
      {(["USD", "IDR"] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={cn(
            "px-2.5 py-1 transition-colors tracking-wider",
            currency === c
              ? "bg-gold text-midnight"
              : "text-cream-deep hover:text-gold",
          )}
          aria-pressed={currency === c}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
