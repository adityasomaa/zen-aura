import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const featured = getFeaturedProducts(8);
  const fallback = featured.length ? featured : getAllProducts().slice(0, 8);

  return (
    <>
      {/* HERO — editorial split */}
      <section className="container-wide pt-12 md:pt-24 pb-20">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-6">
              Ubud · Bali · Est. 2023
            </div>
            <h1 className="font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] tracking-tight">
              Cosmic creations <br />
              for <em className="italic text-terracotta">divine beings.</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-ink-soft leading-relaxed">
              Handcrafted bohemian fashion, silver jewelry, and spiritual
              treasures, made in Ubud by a collective of visionary artisans.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 text-sm uppercase tracking-widest hover:bg-terracotta transition-colors"
              >
                Shop the collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
              >
                Our story
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="aspect-[3/4] bg-gradient-to-br from-paper-deep via-ochre/20 to-terracotta/30 border border-line" />
            <div className="mt-3 text-xs uppercase tracking-widest text-ink-muted">
              Halter Dress · Jungle Teal
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-wide pb-20">
        <div className="rule pt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Fashion",
              href: "/shop/fashion",
              note: "Viscose halter dresses, drapes, festival hats.",
            },
            {
              title: "Jewelry",
              href: "/shop/jewelry",
              note: "Silver adornments. Spiritual amulets.",
            },
            {
              title: "Interiors",
              href: "/shop/interiors",
              note: "Lighting, painted decor, ritual objects.",
            },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group block border border-line bg-paper hover:bg-paper-deep/40 transition-colors p-8"
            >
              <div className="font-display text-3xl mb-2">{c.title}</div>
              <p className="text-sm text-ink-soft mb-6">{c.note}</p>
              <span className="text-xs uppercase tracking-widest text-ink-muted group-hover:text-terracotta transition-colors">
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-wide pb-24">
        <header className="rule pt-10 mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-2">
              The collection
            </div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">
              Handpicked pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline text-xs uppercase tracking-widest text-ink-soft hover:text-terracotta transition-colors"
          >
            View all →
          </Link>
        </header>
        <ProductGrid products={fallback} priorityCount={4} />
      </section>
    </>
  );
}
