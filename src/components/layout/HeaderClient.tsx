"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { MobileMenu } from "./MobileMenu";

export function HeaderClient() {
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const hydrated = useCart((s) => s.hydrated);

  return (
    <div className="flex items-center gap-3 md:gap-4 text-sm">
      <div className="hidden lg:block">
        <CurrencySwitcher />
      </div>
      <Link
        href="/cart"
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-midnight transition-colors"
        aria-label={`Cart, ${hydrated ? count : 0} items`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M4 6h16l-1.5 11.2a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 6Z" />
          <path d="M8 6V4.5a4 4 0 1 1 8 0V6" />
        </svg>
        {hydrated && count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-gold text-midnight text-[10px] font-display rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
            {count}
          </span>
        )}
      </Link>
      <MobileMenu />
    </div>
  );
}
