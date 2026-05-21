"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  dropdown?: { href: string; label: string; hint?: string }[];
}

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  {
    href: "/shop",
    label: "Product",
    dropdown: [
      { href: "/shop", label: "View all", hint: "the complete collection" },
      { href: "/shop/fashion", label: "Fashion", hint: "Alternative Attire · Ubud" },
      { href: "/shop/jewelry", label: "Jewelry", hint: "Bijoux · Amed, East Bali" },
      { href: "/shop/interiors", label: "Interiors", hint: "Bohemian Décor · Bali" },
    ],
  },
  { href: "/meet-the-creators", label: "Meet the Creators" },
  { href: "/shipping", label: "Shipping" },
  { href: "/contact", label: "Contact Us" },
];

export function NavMenu() {
  const pathname = usePathname();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click / route change / Esc
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpenIdx(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIdx(null);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    setOpenIdx(null);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav
      ref={wrapperRef}
      className="hidden lg:flex items-center gap-1 text-[14px]"
      aria-label="Primary"
    >
      {NAV.map((item, i) => {
        const active = isActive(item.href);
        const hasDropdown = !!item.dropdown;
        const open = openIdx === i;

        if (!hasDropdown) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-full transition-colors",
                active
                  ? "text-gold"
                  : "text-cream-deep hover:text-gold",
              )}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => setOpenIdx(i)}
            onMouseLeave={() => setOpenIdx((cur) => (cur === i ? null : cur))}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpenIdx(open ? null : i)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors",
                active || open
                  ? "text-gold"
                  : "text-cream-deep hover:text-gold",
              )}
            >
              <span>{item.label}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
                className={cn(
                  "transition-transform duration-300",
                  open && "rotate-180",
                )}
              >
                <path d="M2 4l3 3 3-3" />
              </svg>
            </button>

            <div
              role="menu"
              aria-label={item.label}
              className={cn(
                "absolute left-0 top-full pt-3 min-w-[280px]",
                "transition-all duration-300",
                open
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-1 pointer-events-none",
              )}
            >
              <div className="bg-eggplant border border-violet rounded-2xl shadow-[0_25px_80px_-30px_rgba(238,217,119,0.35)] overflow-hidden">
                {item.dropdown!.map((sub, j) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    role="menuitem"
                    className={cn(
                      "block px-5 py-3 transition-colors group/sub",
                      j !== 0 && "border-t border-violet/50",
                      "hover:bg-violet/40",
                    )}
                  >
                    <div className="font-display text-cream group-hover/sub:text-gold transition-colors text-base">
                      {sub.label}
                    </div>
                    {sub.hint && (
                      <div className="text-[11px] uppercase tracking-[0.18em] text-cream-deep/70 mt-0.5">
                        {sub.hint}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
