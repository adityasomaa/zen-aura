import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-deep/40">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl">ZenAura Bali</div>
          <p className="mt-3 text-sm text-ink-soft max-w-xs">
            Handcrafted bohemian fashion, silver jewelry, and spiritual treasures
            from Ubud, Bali.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-ink-muted mb-4">
            Shop
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop/fashion" className="hover:text-ink text-ink-soft">Fashion</Link></li>
            <li><Link href="/shop/jewelry" className="hover:text-ink text-ink-soft">Jewelry</Link></li>
            <li><Link href="/shop/interiors" className="hover:text-ink text-ink-soft">Interiors</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-ink-muted mb-4">
            About
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-ink text-ink-soft">Our Story</Link></li>
            <li><Link href="/meet-the-creators" className="hover:text-ink text-ink-soft">Meet the Creators</Link></li>
            <li><Link href="/shipping" className="hover:text-ink text-ink-soft">Shipping</Link></li>
            <li><Link href="/terms" className="hover:text-ink text-ink-soft">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-ink-muted mb-4">
            Newsletter
          </h4>
          <p className="text-sm text-ink-soft mb-3">
            Sign up for cosmic creations + new arrivals.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink"
            />
            <button
              type="submit"
              className="bg-ink text-paper px-4 py-2 text-sm hover:bg-terracotta transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="container-wide py-6 rule flex flex-col md:flex-row justify-between gap-2 text-xs text-ink-muted">
        <div>© {new Date().getFullYear()} ZenAura Bali. Crafted in Ubud.</div>
        <div>
          <a
            href="https://instagram.com/zenaura_bali"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
