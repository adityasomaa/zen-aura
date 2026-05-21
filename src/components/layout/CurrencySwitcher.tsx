"use client";

import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

export function CurrencySwitcher() {
  const currency = useCart((s) => s.currency);
  const setCurrency = useCart((s) => s.setCurrency);

  return (
    <div className="inline-flex border border-line text-xs">
      {(["USD", "IDR"] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={cn(
            "px-2.5 py-1 transition-colors",
            currency === c
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink",
          )}
          aria-pressed={currency === c}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
