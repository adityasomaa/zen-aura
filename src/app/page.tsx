import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/motion/Reveal";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const featured = getFeaturedProducts(8);
  const fallback = featured.length ? featured : getAllProducts().slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative starfield overflow-hidden">
        <div className="container-wide pt-16 md:pt-24 pb-24 md:pb-32 grid lg:grid-cols-2 gap-14 items-center">
          <HeroIntro>
            <div className="hero-item italic font-display text-gold-soft/80 text-lg md:text-xl mb-3">
              Bohemian Fashion &amp; Spiritual Boutique in Ubud
            </div>
            <h1 className="hero-item font-display text-gold leading-[0.95] tracking-tight text-[clamp(3rem,10vw,8rem)]">
              ZenAura <em className="italic">Bali</em>
            </h1>
            <p className="hero-item mt-8 max-w-xl text-lg md:text-xl text-cream-deep leading-relaxed">
              Discover ZenAura Bali — a unique bohemian boutique in the heart of
              Ubud offering handcrafted fashion, silver jewelry, spiritual
              tools, and artistic treasures inspired by Bali&rsquo;s creative
              and soulful energy.
            </p>
            <div className="hero-item mt-10 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-gold">
                Shop the collection
              </Link>
              <Link href="/about" className="btn-ghost">
                Our story
              </Link>
            </div>
          </HeroIntro>

          <div className="hidden lg:flex justify-center">
            <div className="relative w-[420px] h-[420px] xl:w-[520px] xl:h-[520px]">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(238,217,119,0.18), transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <Image
                src="/brand/logo.jpg"
                alt="ZenAura Bali"
                fill
                priority
                sizes="(min-width:1280px) 520px, 420px"
                className="object-cover rounded-full ring-1 ring-gold/30 shadow-[0_0_60px_rgba(238,217,119,0.25)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VIEW OUR PRODUCTS */}
      <section className="bg-eggplant pt-16 pb-24">
        <Reveal className="container-wide">
          <div className="reveal-item text-center">
            <h2 className="font-display text-gold text-5xl md:text-7xl tracking-tight">
              View <em className="italic">Our Products</em>
            </h2>
            <p className="mt-5 text-cream-deep text-lg max-w-2xl mx-auto">
              Handcrafted fashion, silver jewelry, and artistic pieces inspired
              by Bali&rsquo;s creative and soulful energy.
            </p>
          </div>
          <div className="reveal-item mt-12">
            <ProductGrid products={fallback} priorityCount={4} />
          </div>
          <div className="reveal-item mt-14 text-center">
            <Link href="/shop" className="btn-gold">
              View all 40 pieces
            </Link>
          </div>
        </Reveal>
      </section>

      {/* CATEGORY CIRCLES */}
      <section className="bg-eggplant pb-24">
        <Reveal className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-14">
            {[
              { title: "Fashion", href: "/shop/fashion" },
              { title: "Interiors", href: "/shop/interiors" },
              { title: "Jewelry", href: "/shop/jewelry" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="reveal-item group relative aspect-square rounded-full overflow-hidden flex items-center justify-center transition-transform duration-700 hover:scale-[1.03]"
                style={{
                  background:
                    "radial-gradient(circle at 50% 55%, #690dac 0%, #301934 70%)",
                  boxShadow: "inset 0 0 60px rgba(238,217,119,0.18)",
                }}
              >
                <div
                  className="absolute inset-0 starfield opacity-60 mix-blend-screen"
                  aria-hidden="true"
                />
                <div className="relative font-script text-gold text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_0_20px_rgba(238,217,119,0.5)]">
                  {c.title}
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SPLIT — about teaser */}
      <section className="bg-midnight">
        <Reveal className="container-wide py-20 md:py-28 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 reveal-item">
            <div className="text-xs uppercase tracking-[0.3em] text-gold/70 mb-5">
              Our story
            </div>
            <h2 className="font-display text-cream text-4xl md:text-6xl leading-[1.05] tracking-tight">
              Born of <em className="italic text-gold">creativity,</em>{" "}
              community, and the magical spirit of Bali.
            </h2>
            <p className="mt-7 text-cream-deep text-lg max-w-2xl leading-relaxed">
              ZenAura is more than a boutique — it is a living collaboration
              between visionary curators and incredibly talented local artisans,
              rooted in the spiritual heart of Ubud.
            </p>
            <Link href="/about" className="mt-9 btn-sage">
              Read the story
            </Link>
          </div>
          <div className="md:col-span-5 reveal-item">
            <div
              className="aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-gold/20"
              style={{
                background:
                  "linear-gradient(135deg, #4a2a52, #301934 60%, #1a0b1e)",
              }}
            >
              <div className="w-full h-full starfield" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
