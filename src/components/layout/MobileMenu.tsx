"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

interface NavRow {
  href: string;
  label: string;
  hint?: string;
  child?: boolean;
}

const ROWS: NavRow[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Product" },
  { href: "/shop", label: "View all", hint: "the complete collection", child: true },
  { href: "/shop/fashion", label: "Fashion", hint: "Alternative Attire · Ubud", child: true },
  { href: "/shop/jewelry", label: "Jewelry", hint: "Bijoux · Amed, East Bali", child: true },
  { href: "/shop/interiors", label: "Interiors", hint: "Bohemian Décor · Bali", child: true },
  { href: "/meet-the-creators", label: "Meet the Creators" },
  { href: "/shipping", label: "Shipping" },
  { href: "/contact", label: "Contact Us" },
];

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currency = useCart((s) => s.currency);
  const setCurrency = useCart((s) => s.setCurrency);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-midnight transition-colors"
        data-cursor="link"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          {open ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M3 7h18" />
              <path d="M3 12h18" />
              <path d="M3 17h18" />
            </>
          )}
        </svg>
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "lg:hidden fixed inset-0 z-[8500] bg-midnight/70 backdrop-blur-md transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "lg:hidden fixed top-0 right-0 bottom-0 z-[8600] w-[88vw] max-w-sm",
          "bg-eggplant border-l border-violet shadow-[0_0_60px_-10px_rgba(0,0,0,0.5)]",
          "transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)]",
          "flex flex-col",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="absolute inset-x-0 top-0 h-40 starfield opacity-25 pointer-events-none" />

        <div className="relative flex items-center justify-between p-5 border-b border-violet">
          <div className="text-[11px] uppercase tracking-[0.32em] text-gold/70">
            ZenAura · Bali
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full text-cream-deep hover:text-gold hover:bg-violet/60 transition-colors flex items-center justify-center"
            data-cursor="link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 6l12 12M18 6l-6 12" />
            </svg>
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto py-3">
          {ROWS.map((row) => {
            const active =
              row.href === "/"
                ? pathname === "/"
                : pathname === row.href ||
                  (!row.child && pathname.startsWith(row.href + "/"));

            return (
              <Link
                key={row.href + row.label}
                href={row.href}
                className={cn(
                  "block px-6 py-3 transition-colors",
                  row.child ? "pl-10" : "",
                  active ? "text-gold" : "text-cream hover:text-gold",
                )}
              >
                <div
                  className={cn(
                    row.child
                      ? "font-display text-lg"
                      : "font-display text-2xl",
                  )}
                >
                  {row.label}
                </div>
                {row.hint && (
                  <div className="text-[11px] uppercase tracking-[0.18em] text-cream-deep/70 mt-0.5">
                    {row.hint}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-violet p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.24em] text-cream-deep">
              Currency
            </span>
            <div className="inline-flex rounded-full border border-gold/40 overflow-hidden text-xs">
              {(["USD", "IDR"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "px-3 py-1 transition-colors tracking-wider",
                    currency === c
                      ? "bg-gold text-midnight"
                      : "text-cream-deep hover:text-gold",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/zenaura_bali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-violet/40 hover:bg-violet text-cream hover:text-gold transition-colors rounded-full py-2.5 text-sm"
              data-cursor="link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a
              href="https://wa.me/6287703592240"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-violet/40 hover:bg-violet text-cream hover:text-gold transition-colors rounded-full py-2.5 text-sm"
              data-cursor="link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M20.5 12a8.5 8.5 0 1 1-3.7-7L20 4l-1 3.3A8.45 8.45 0 0 1 20.5 12Z" />
                <path d="M8 11.5c.5 1.5 2 3 3.5 3.5l1-1c.3-.3.8-.4 1.2-.2l2.3 1c.4.2.6.6.5 1L16 16.5a1.5 1.5 0 0 1-1.6 1c-2.3-.1-7.3-2.6-8.5-7.7A1.5 1.5 0 0 1 7 8l1-.5c.4-.1.8.1 1 .5l1 2.3c.2.4.1.9-.2 1.2l-1 1Z" />
              </svg>
              WhatsApp
            </a>
          </div>

          <p className="italic text-[11px] leading-relaxed text-cream-deep/70 text-center">
            Supporting talented family-run craftswomen &amp; craftsmen throughout Bali &amp; Java.
          </p>
        </div>
      </aside>
    </>
  );
}
