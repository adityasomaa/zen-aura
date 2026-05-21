import Link from "next/link";

const NAV = [
  { href: "/shop/fashion", label: "Fashion" },
  { href: "/shop/jewelry", label: "Jewelry" },
  { href: "/shop/interiors", label: "Interiors" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between gap-8">
        <Link href="/" className="font-display text-xl tracking-tight">
          ZenAura<span className="text-ink-muted"> · Bali</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-ink-soft hover:text-ink transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-sm">
          <button
            aria-label="Switch currency"
            className="text-ink-soft hover:text-ink transition-colors"
          >
            USD
          </button>
          <Link
            href="/cart"
            className="text-ink-soft hover:text-ink transition-colors"
          >
            Cart <span className="text-ink-muted">(0)</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
