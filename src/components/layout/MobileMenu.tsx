"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const currency = useCart((s) => s.currency);
  const setCurrency = useCart((s) => s.setCurrency);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

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

      {mounted && createPortal(<Overlay open={open} pathname={pathname} onClose={() => setOpen(false)} currency={currency} setCurrency={setCurrency} />, document.body)}
    </>
  );
}

interface OverlayProps {
  open: boolean;
  pathname: string;
  onClose: () => void;
  currency: "USD" | "IDR";
  setCurrency: (c: "USD" | "IDR") => void;
}

/**
 * Mobile menu overlay, rendered into <body> via a portal so it escapes
 * any transformed/clipped ancestors (Lenis wrapper, etc).
 *
 * All positioning uses INLINE STYLES to bypass any global CSS or
 * Tailwind-generated class that could override it.
 */
function Overlay({ open, pathname, onClose, currency, setCurrency }: OverlayProps) {
  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9700,
        backgroundColor: "#301934",
        display: open ? "block" : "none",
      }}
      className="lg:hidden"
    >
      {/* Decorative starfield */}
      <div
        aria-hidden="true"
        className="absolute inset-0 starfield pointer-events-none"
        style={{ opacity: 0.25 }}
      />

      {/* Header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 20,
          borderBottom: "1px solid #4a2a52",
          backgroundColor: "#301934",
          zIndex: 2,
        }}
      >
        <div className="text-[11px] uppercase tracking-[0.32em] text-gold/70">
          ZenAura · Bali
        </div>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="w-10 h-10 rounded-full text-gold border border-gold/40 hover:bg-gold hover:text-midnight transition-colors flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 6l12 12M18 6l-6 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable nav area */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 0,
          right: 0,
          bottom: 220,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          paddingBlock: 16,
          zIndex: 1,
        }}
      >
        <nav aria-label="Mobile primary navigation">
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
                onClick={onClose}
                className={cn(
                  "block transition-colors",
                  row.child ? "px-10 py-2.5" : "px-6 py-3",
                  active ? "text-gold" : "text-cream hover:text-gold",
                )}
              >
                <div
                  className={cn(
                    "font-display leading-tight",
                    row.child ? "text-lg" : "text-2xl",
                  )}
                >
                  {row.label}
                </div>
                {row.hint && (
                  <div className="text-[10px] uppercase tracking-[0.18em] text-cream-deep/70 mt-0.5">
                    {row.hint}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 20,
          borderTop: "1px solid #4a2a52",
          backgroundColor: "#301934",
          zIndex: 2,
        }}
      >
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

        <div className="grid grid-cols-2 gap-2 mt-3">
          <a
            href="https://instagram.com/zenaura_bali"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-violet/40 hover:bg-violet text-cream hover:text-gold transition-colors rounded-full py-2.5 text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
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
            className="inline-flex items-center justify-center gap-2 bg-violet/40 hover:bg-violet text-cream hover:text-gold transition-colors rounded-full py-2.5 text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M20.5 12a8.5 8.5 0 1 1-3.7-7L20 4l-1 3.3A8.45 8.45 0 0 1 20.5 12Z" />
              <path d="M8 11.5c.5 1.5 2 3 3.5 3.5l1-1c.3-.3.8-.4 1.2-.2l2.3 1c.4.2.6.6.5 1L16 16.5a1.5 1.5 0 0 1-1.6 1c-2.3-.1-7.3-2.6-8.5-7.7A1.5 1.5 0 0 1 7 8l1-.5c.4-.1.8.1 1 .5l1 2.3c.2.4.1.9-.2 1.2l-1 1Z" />
            </svg>
            WhatsApp
          </a>
        </div>

        <p className="italic text-[10px] leading-relaxed text-cream-deep/70 text-center pt-3">
          Supporting talented family-run craftswomen &amp; craftsmen throughout Bali &amp; Java.
        </p>
      </div>
    </div>
  );
}
