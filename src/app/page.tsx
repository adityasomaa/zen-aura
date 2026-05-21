import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { Marquee } from "@/components/motion/Marquee";
import { Parallax } from "@/components/motion/Parallax";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { formatPrice } from "@/lib/currency";

export default function Home() {
  const all = getAllProducts();
  const featured = getFeaturedProducts(10);
  const pool = featured.length ? featured : all;

  const hero = pool.find((p) => p.images[0]) ?? all[0];
  const showcase = pool.find((p) => p !== hero && p.images[0]) ?? hero;
  const collectionGrid = pool
    .filter((p) => p !== hero && p !== showcase && p.images[0])
    .slice(0, 8);

  const showcaseTitle = showcase.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();

  return (
    <>
      {/* ============ HERO (compact split) ============ */}
      <section className="relative bg-eggplant overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 starfield opacity-50"
        />
        <div className="relative container-wide pt-12 md:pt-20 pb-12 md:pb-20 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-gold/50" />
              Ubud · Bali · Est. 2023
            </div>
            <SplitReveal
              as="h1"
              className="font-display text-cream text-[clamp(2.4rem,6.5vw,5.25rem)] leading-[0.98] tracking-[-0.02em]"
              trigger="mount"
              stagger={0.05}
              delay={0.1}
            >
              Cosmic creations for divine beings.
            </SplitReveal>
            <p className="mt-6 max-w-lg text-cream-deep text-base md:text-lg leading-relaxed">
              Handcrafted bohemian fashion, silver jewelry, and spiritual
              treasures from the heart of Ubud — pieces that carry the breath
              of their maker.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton
                as="a"
                href="/shop"
                className="btn-gold"
                data-cursor="link"
              >
                Shop the collection
              </MagneticButton>
              <Link
                href="/about"
                className="text-cream-deep text-[13px] uppercase tracking-[0.22em] hover:text-gold transition-colors px-4 py-3"
              >
                Our story →
              </Link>
            </div>
          </div>

          {hero?.images[0] && (
            <div className="lg:col-span-5">
              <Link
                href={`/products/${hero.handle}`}
                className="group block relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-violet"
                data-cursor="link"
              >
                <Image
                  src={hero.images[0].src}
                  alt={hero.images[0].alt}
                  fill
                  priority
                  sizes="(min-width:1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-midnight/90 to-transparent">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80 mb-1">
                    Featured
                  </div>
                  <div className="font-display text-cream text-lg md:text-xl leading-tight line-clamp-1">
                    {hero.title.replace(/[🪬🌴🔮✨💫]/g, "").trim()}
                  </div>
                  <div className="text-gold text-sm mt-1">
                    {formatPrice(hero.priceUsd, "USD")}
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-violet/50">
          <div className="container-wide py-5 grid grid-cols-2 md:grid-cols-4 gap-y-3 text-[12px] text-cream-deep">
            {[
              ["40", "pieces in the collection"],
              ["10", "limited colorways"],
              ["100%", "handcrafted in Ubud"],
              ["DHL", "worldwide shipping"],
            ].map(([n, label]) => (
              <div key={label} className="flex items-baseline gap-3">
                <span className="font-display text-gold text-xl tabular-nums">
                  {n}
                </span>
                <span className="uppercase tracking-[0.15em]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="bg-gold text-midnight">
        <Marquee
          items={[
            "Handcrafted in Ubud",
            "Worldwide shipping via DHL",
            "Spiritual treasures",
            "New Year sale · 10% off all products",
            "Cosmic creations for divine beings",
            "Limited runs · slow made",
          ]}
          className="text-sm md:text-base font-display tracking-tight"
        />
      </div>

      {/* ============ THE COLLECTION — denser grid ============ */}
      <section className="bg-eggplant py-16 md:py-24">
        <div className="container-wide">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="reveal-item">
              <div className="text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-2">
                The collection · {all.length} pieces
              </div>
              <h2 className="font-display text-cream text-3xl md:text-5xl tracking-tight leading-[1.02]">
                Wear the cosmos.
              </h2>
            </div>
            <div className="reveal-item flex items-center gap-5">
              <Link
                href="/shop/fashion"
                className="text-cream-deep hover:text-gold text-[13px] uppercase tracking-[0.2em] transition-colors"
              >
                Fashion
              </Link>
              <Link
                href="/shop/interiors"
                className="text-cream-deep hover:text-gold text-[13px] uppercase tracking-[0.2em] transition-colors"
              >
                Interiors
              </Link>
              <Link
                href="/shop"
                className="text-gold hover:text-gold-bright text-[13px] uppercase tracking-[0.2em] transition-colors"
              >
                View all →
              </Link>
            </div>
          </Reveal>
          <ProductGrid
            products={collectionGrid}
            columns={4}
            size="md"
            priorityCount={4}
          />
        </div>
      </section>

      {/* ============ FEATURED PIECE (asymmetric, restrained) ============ */}
      <section className="bg-eggplant-deep">
        <div className="container-wide py-16 md:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative">
            {showcase.images[0] && (
              <Link
                href={`/products/${showcase.handle}`}
                className="relative block aspect-[5/6] rounded-3xl overflow-hidden ring-1 ring-violet"
                data-cursor="link"
              >
                <Image
                  src={showcase.images[0].src}
                  alt={showcase.images[0].alt}
                  fill
                  sizes="(min-width:1024px) 55vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.03]"
                />
                <div className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.28em] text-gold/90 bg-midnight/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  The piece
                </div>
              </Link>
            )}
          </div>
          <Reveal className="lg:col-span-5">
            <div className="reveal-item text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-3">
              {showcase.category}
            </div>
            <h3 className="reveal-item font-display text-cream text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
              {showcaseTitle.split(" ").slice(0, 3).join(" ")}{" "}
              <em className="italic text-gold">
                {showcaseTitle.split(" ").slice(3).join(" ") || ""}
              </em>
            </h3>
            {showcase.subtitle && (
              <p className="reveal-item mt-4 italic text-base text-cream-deep">
                {showcase.subtitle}
              </p>
            )}
            <p className="reveal-item mt-5 text-cream-deep text-base leading-relaxed max-w-md">
              Handcrafted in Ubud from soft-touch natural fibre viscose. One of
              a limited run — each piece carries the breath of its maker.
            </p>
            <div className="reveal-item mt-8 flex flex-wrap items-baseline gap-5">
              <span className="font-display text-gold text-2xl tabular-nums">
                {formatPrice(showcase.priceUsd, "USD")}
              </span>
              <MagneticButton
                as="a"
                href={`/products/${showcase.handle}`}
                className="btn-gold"
                data-cursor="link"
              >
                Discover the piece
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ STORY (compact split) ============ */}
      <section className="bg-eggplant overflow-hidden">
        <div className="container-wide py-16 md:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-5">
            <div className="reveal-item text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-3">
              Our story
            </div>
            <h2 className="reveal-item font-display text-cream text-3xl md:text-5xl leading-[1.05] tracking-tight">
              Born of <em className="italic text-gold">creativity,</em>{" "}
              community, and the spirit of Bali.
            </h2>
            <p className="reveal-item mt-6 text-cream-deep text-base leading-relaxed max-w-md">
              ZenAura is a living collaboration between visionary curators and
              Balinese artisans. Each piece is thoughtfully designed, ethically
              sourced, and lovingly handcrafted — rooted in Ubud&rsquo;s
              spiritual heart.
            </p>
            <MagneticButton
              as="a"
              href="/about"
              className="btn-sage mt-7"
              data-cursor="link"
            >
              Read the full story
            </MagneticButton>
          </Reveal>
          <div className="lg:col-span-7 relative h-[55vh] lg:h-[70vh]">
            <div className="relative h-full overflow-hidden rounded-3xl ring-1 ring-violet">
              <Parallax amount={80} className="h-full">
                {hero?.images[1] ? (
                  <Image
                    src={hero.images[1].src}
                    alt={hero.images[1].alt}
                    fill
                    sizes="(min-width:1024px) 55vw, 100vw"
                    className="object-cover scale-110"
                  />
                ) : (
                  <div className="h-full starfield" />
                )}
              </Parallax>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES — compact horizontal ============ */}
      <section className="bg-eggplant-deep border-y border-violet/40">
        <div className="container-wide py-14 md:py-20">
          <Reveal className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-center">
            <div className="reveal-item">
              <div className="text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-2">
                Three worlds
              </div>
              <h2 className="font-display text-cream text-3xl md:text-4xl leading-tight">
                Choose your <em className="italic text-gold">orbit.</em>
              </h2>
            </div>
            <div className="reveal-item grid grid-cols-3 gap-3 md:gap-5">
              {[
                { title: "Fashion", href: "/shop/fashion", count: "34 pieces" },
                { title: "Interiors", href: "/shop/interiors", count: "3 pieces" },
                { title: "Jewelry", href: "/shop/jewelry", count: "Coming soon" },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  data-cursor="link"
                  className="group relative aspect-[5/6] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 transition-transform duration-700 hover:-translate-y-1"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 60%, #690dac 0%, #301934 80%)",
                    boxShadow:
                      "inset 0 0 40px rgba(238,217,119,0.18), 0 14px 40px -20px rgba(238,217,119,0.25)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 starfield opacity-50 mix-blend-screen"
                  />
                  <div className="relative font-script text-gold text-4xl md:text-5xl lg:text-6xl drop-shadow-[0_0_14px_rgba(238,217,119,0.45)]">
                    {c.title}
                  </div>
                  <div className="relative text-[10px] mt-2 uppercase tracking-[0.2em] text-cream/70">
                    {c.count}
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ INVITATION ============ */}
      <section className="bg-eggplant">
        <Reveal className="container-narrow py-20 md:py-28 text-center">
          <div className="reveal-item text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-4">
            An invitation
          </div>
          <h2 className="reveal-item font-display text-cream text-3xl md:text-5xl leading-[1.1] tracking-tight">
            Wear something <em className="italic text-gold">made by hand,</em>{" "}
            for the soul it&rsquo;s made for.
          </h2>
          <div className="reveal-item mt-10">
            <MagneticButton
              as="a"
              href="/shop"
              className="btn-gold"
              data-cursor="link"
            >
              Enter the collection
            </MagneticButton>
          </div>
        </Reveal>
      </section>

      {/* ============ CLOSING MARQUEE ============ */}
      <div className="bg-eggplant-deep text-cream/70 border-t border-violet/40">
        <Marquee
          items={[
            "ZenAura Bali",
            "Est. Ubud",
            "Worldwide shipping",
            "Handcrafted",
            "Cosmic creations",
          ]}
          className="text-sm md:text-base font-display italic"
        />
      </div>
    </>
  );
}
