"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { CurrencySwitcher } from "./CurrencySwitcher";

export function HeaderClient() {
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const hydrated = useCart((s) => s.hydrated);

  return (
    <div className="flex items-center gap-5 text-sm">
      <CurrencySwitcher />
      <Link
        href="/cart"
        className="text-ink-soft hover:text-ink transition-colors"
      >
        Cart{" "}
        <span className="text-ink-muted tabular-nums">
          ({hydrated ? count : 0})
        </span>
      </Link>
    </div>
  );
}
