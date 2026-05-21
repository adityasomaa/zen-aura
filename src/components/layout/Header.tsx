import Image from "next/image";
import Link from "next/link";
import { HeaderClient } from "./HeaderClient";

const NAV = [
  { href: "/shop/fashion", label: "Fashion" },
  { href: "/shop/interiors", label: "Interiors" },
  { href: "/shop/jewelry", label: "Jewelry" },
  { href: "/about", label: "About Us" },
  { href: "/meet-the-creators", label: "Meet the Creators" },
  { href: "/shipping", label: "Shipping" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-midnight/95 backdrop-blur-md border-b border-violet">
      <div className="bg-eggplant text-gold-soft text-center text-xs py-2 tracking-wider">
        New Year Sale — 10% Off ALL Products
      </div>
      <div className="container-wide flex h-20 items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3" aria-label="ZenAura Bali home">
          <span className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-gold/40">
            <Image
              src="/brand/logo.jpg"
              alt="ZenAura Bali"
              fill
              sizes="48px"
              priority
              className="object-cover"
            />
          </span>
          <span className="hidden sm:inline font-display text-2xl text-gold tracking-tight">
            ZenAura <span className="text-cream-deep">Bali</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-[15px]">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-cream-deep hover:text-gold transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <HeaderClient />
      </div>
    </header>
  );
}
