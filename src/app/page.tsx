import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";
import { FeaturedShowcase } from "@/components/product/FeaturedShowcase";
import { EditorialGrid } from "@/components/product/EditorialGrid";
import { Marquee } from "@/components/motion/Marquee";
import { Parallax } from "@/components/motion/Parallax";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

export default function Home() {
  const all = getAllProducts();
  const featured = getFeaturedProducts(8);
  const pool = featured.length ? featured : all;

  // Pick a hero product whose first image exists
  const hero = pool.find((p) => p.images[0]) ?? all[0];
  const showcase = pool.find((p) => p !== hero && p.images[0]) ?? hero;
  const grid = pool
    .filter((p) => p !== hero && p !== showcase && p.images[0])
    .slice(0, 5);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative isolate min-h-[88vh] md:min-h-[100vh] flex items-end overflow-hidden grain">
        {hero?.images[0] && (
          <Image
            src={hero.images[0].src}
            alt={hero.images[0].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
        )}
        {/* Gradient + cosmic overlay — stronger left/bottom shading so text reads */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(26,11,30,0.85) 0%, rgba(26,11,30,0.55) 45%, rgba(26,11,30,0.2) 100%), linear-gradient(180deg, rgba(26,11,30,0.2) 0%, rgba(26,11,30,0.85) 100%)",
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 starfield opacity-25 mix-blend-screen" />

        <div className="relative container-bleed pb-16 md:pb-24 w-full">
          <div className="max-w-5xl">
            <div className="font-script text-gold text-4xl md:text-5xl mb-2 opacity-90">
              ZenAura Bali
            </div>
            <SplitReveal
              as="h1"
              className="font-display text-cream text-[clamp(3.2rem,11vw,11rem)] leading-[0.88] tracking-[-0.025em] drop-shadow-[0_4px_30px_rgba(26,11,30,0.7)]"
              trigger="mount"
              stagger={0.06}
              delay={0.15}
            >
              Cosmic creations for divine beings.
            </SplitReveal>
            <div className="mt-8 max-w-xl text-cream-deep/90 text-lg leading-relaxed">
              Handcrafted bohemian fashion, silver jewelry, and spiritual
              treasures from the heart of Ubud — pieces that carry the breath
              of their maker.
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton
                as="a"
                href="/shop"
                className="btn-gold"
                data-cursor="link"
              >
                Enter the collection
              </MagneticButton>
              <Link
                href="/about"
                className="text-cream text-sm uppercase tracking-[0.25em] hover:text-gold transition-colors"
              >
                Our story →
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream/60 text-[10px] uppercase tracking-[0.4em] flex flex-col items-center gap-2"
        >
          <span>Scroll</span>
          <span className="w-px h-10 bg-cream/40 animate-pulse" />
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="bg-gold text-midnight border-y border-midnight/10">
        <Marquee
          items={[
            "Handcrafted in Ubud",
            "Worldwide Shipping via DHL",
            "Spiritual Treasures",
            "New Year Sale · 10% Off ALL Products",
            "Cosmic Creations for Divine Beings",
            "Limited Runs · Slow Made",
          ]}
          className="text-xl md:text-2xl font-display tracking-tight"
        />
      </div>

      {/* ============ FEATURED SHOWCASE ============ */}
      {showcase && <FeaturedShowcase product={showcase} eyebrow="The piece" />}

      {/* ============ EDITORIAL GRID ============ */}
      <section className="bg-eggplant py-24 md:py-32">
        <div className="container-bleed">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold/70 mb-3">
                The new collection
              </div>
              <SplitReveal
                as="h2"
                className="font-display text-cream text-5xl md:text-7xl tracking-tight leading-[0.95]"
                stagger={0.05}
              >
                Wear the cosmos.
              </SplitReveal>
            </div>
            <Link
              href="/shop"
              className="text-cream-deep hover:text-gold text-sm uppercase tracking-[0.25em] transition-colors self-start md:self-end"
            >
              View all {all.length} pieces →
            </Link>
          </div>
          <EditorialGrid products={grid} />
        </div>
      </section>

      {/* ============ STORY (parallax) ============ */}
      <section className="bg-midnight overflow-hidden">
        <div className="container-bleed py-24 md:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold/70 mb-5">
              Our story
            </div>
            <SplitReveal
              as="h2"
              className="font-display text-cream text-5xl md:text-7xl leading-[0.95] tracking-tight"
              stagger={0.05}
            >
              Born of creativity, community, and the spirit of Bali.
            </SplitReveal>
            <p className="mt-8 text-cream-deep text-lg leading-relaxed max-w-md">
              ZenAura is a living collaboration between visionary curators and
              Balinese artisans. Each piece is thoughtfully designed, ethically
              sourced, and lovingly handcrafted — rooted in Ubud&rsquo;s
              spiritual heart.
            </p>
            <MagneticButton
              as="a"
              href="/about"
              className="btn-sage mt-10"
              data-cursor="link"
            >
              Read the full story
            </MagneticButton>
          </div>
          <div className="lg:col-span-7 relative h-[60vh] md:h-[80vh]">
            <div className="relative h-full overflow-hidden rounded-[36px] ring-1 ring-violet">
              <Parallax amount={120} className="h-full">
                {hero?.images[1] ? (
                  <Image
                    src={hero.images[1].src}
                    alt={hero.images[1].alt}
                    fill
                    sizes="(min-width:1024px) 60vw, 100vw"
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

      {/* ============ CATEGORY ORBS ============ */}
      <section className="bg-eggplant py-24 md:py-32">
        <div className="container-bleed">
          <div className="text-center mb-14">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold/70 mb-3">
              Three worlds
            </div>
            <h2 className="font-display text-cream text-5xl md:text-7xl tracking-tight">
              Choose your <em className="italic text-gold">orbit.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Fashion", href: "/shop/fashion" },
              { title: "Interiors", href: "/shop/interiors" },
              { title: "Jewelry", href: "/shop/jewelry" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                data-cursor="link"
                className="group relative aspect-square rounded-full overflow-hidden flex items-center justify-center transition-transform duration-700 hover:scale-[1.05]"
                style={{
                  background:
                    "radial-gradient(circle at 50% 55%, #690dac 0%, #301934 70%)",
                  boxShadow: "inset 0 0 60px rgba(238,217,119,0.18), 0 30px 80px -40px rgba(238,217,119,0.3)",
                }}
              >
                <div
                  className="absolute inset-0 starfield opacity-60 mix-blend-screen"
                  aria-hidden="true"
                />
                <div className="relative font-script text-gold text-7xl md:text-8xl lg:text-9xl drop-shadow-[0_0_24px_rgba(238,217,119,0.5)] transition-transform duration-700 group-hover:rotate-[-3deg]">
                  {c.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLOSING MARQUEE ============ */}
      <div className="bg-eggplant-deep text-cream/80 border-y border-violet/40">
        <Marquee
          items={[
            "ZenAura Bali",
            "Est. Ubud",
            "Worldwide Shipping",
            "Handcrafted",
            "Cosmic Creations",
          ]}
          className="text-xl md:text-3xl font-display italic"
        />
      </div>
    </>
  );
}
