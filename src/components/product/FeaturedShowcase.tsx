"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/types";
import { MagneticButton } from "@/components/motion/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  product: Product;
  eyebrow?: string;
}

export function FeaturedShowcase({ product, eyebrow = "Featured piece" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const cleanTitle = product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();
  const cover = product.images[0];

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const img = ref.current!.querySelector(".fs-img");
      const text = ref.current!.querySelectorAll(".fs-text");
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.08 },
          {
            yPercent: 8,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
      gsap.set(text, { autoAlpha: 0, y: 30 });
      gsap.to(text, {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [product.handle]);

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className="relative bg-eggplant-deep overflow-hidden"
    >
      <div className="container-bleed py-24 md:py-32 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7 relative">
          <div className="relative aspect-[5/6] lg:aspect-[6/7] rounded-[36px] overflow-hidden ring-1 ring-violet">
            {cover && (
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="fs-img object-cover scale-110"
                priority
              />
            )}
          </div>
          <div className="absolute top-6 left-6 text-[11px] uppercase tracking-[0.3em] text-gold/80 bg-midnight/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {eyebrow}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="fs-text text-[11px] uppercase tracking-[0.3em] text-gold/70 mb-5">
            {product.category}
          </div>
          <h2 className="fs-text font-display text-cream text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight">
            {cleanTitle.split(" ").slice(0, 4).join(" ")}{" "}
            <em className="italic text-gold">
              {cleanTitle.split(" ").slice(4).join(" ") || "."}
            </em>
          </h2>
          {product.subtitle && (
            <p className="fs-text mt-6 italic text-xl text-cream-deep">
              {product.subtitle}
            </p>
          )}
          <p className="fs-text mt-6 text-cream-deep text-lg leading-relaxed max-w-md">
            Handcrafted in Ubud from soft-touch natural fibre viscose. One of a
            limited run — each piece carries the breath of its maker.
          </p>
          <div className="fs-text mt-10 flex flex-wrap items-center gap-5">
            <MagneticButton
              as="a"
              href={`/products/${product.handle}`}
              className="btn-gold"
              data-cursor="link"
            >
              Discover the piece
            </MagneticButton>
            <Link
              href="/shop"
              className="text-cream-deep hover:text-gold text-sm uppercase tracking-[0.2em] transition-colors"
            >
              View all collection →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
