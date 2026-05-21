import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-midnight text-cream-deep">
      <div className="bg-gold text-midnight">
        <div className="container-wide py-10 md:py-14 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
          <div className="font-display text-2xl md:text-4xl leading-tight max-w-xl">
            Join our Newsletter <span className="opacity-70">—</span> Get
            updates, offers and invites.
          </div>
          <form className="flex-1 w-full md:w-auto flex items-center gap-3 border-b border-midnight/40 pb-2">
            <input
              type="email"
              required
              placeholder="Email address"
              className="flex-1 bg-transparent placeholder:text-midnight/60 focus:outline-none text-lg"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="text-2xl hover:translate-x-1 transition-transform"
            >
              →
            </button>
          </form>
        </div>
      </div>

      <div className="container-wide py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-3xl text-gold mb-3">ZenAura</div>
          <p className="text-sm leading-relaxed max-w-xs">
            Handcrafted bohemian fashion, silver jewelry, and spiritual
            treasures, made in Ubud, Bali.
          </p>
          <p className="italic text-[13px] text-cream-deep/80 mt-4 max-w-xs leading-relaxed">
            Supporting talented family-run craftswomen &amp; craftsmen throughout
            Bali &amp; Java.
          </p>
        </div>

        <div>
          <h4 className="font-display text-xl text-gold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop/fashion" className="hover:text-gold">Fashion</Link></li>
            <li><Link href="/shop/jewelry" className="hover:text-gold">Jewelry</Link></li>
            <li><Link href="/shop/interiors" className="hover:text-gold">Interiors</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl text-gold mb-4">About</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-gold">Our Story</Link></li>
            <li><Link href="/meet-the-creators" className="hover:text-gold">Meet the Creators</Link></li>
            <li><Link href="/shipping" className="hover:text-gold">Shipping</Link></li>
            <li><Link href="/terms" className="hover:text-gold">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-gold">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl text-gold mb-4">Stay Connected</h4>
          <a
            href="https://instagram.com/zenaura_bali"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:text-gold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            @zenaura_bali
          </a>
        </div>
      </div>

      <div className="border-t border-violet">
        <div className="container-wide py-6 flex flex-col md:flex-row justify-between gap-2 text-xs">
          <div>© {new Date().getFullYear()} ZenAura Bali. Crafted in Ubud.</div>
          <div>Worldwide shipping via DHL.</div>
        </div>
      </div>
    </footer>
  );
}
