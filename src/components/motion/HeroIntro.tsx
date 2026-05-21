"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Wraps the hero block and plays a curtain-up intro on mount.
 * Children with `.hero-item` class animate sequentially.
 */
export function HeroIntro({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>(".hero-item");
      gsap.set(items, { autoAlpha: 0, y: 32 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
