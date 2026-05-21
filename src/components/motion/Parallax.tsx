"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  children: React.ReactNode;
  /** How far the element moves over its scroll-through, in px */
  amount?: number;
  /** Direction */
  direction?: "up" | "down";
  className?: string;
}

export function Parallax({
  children,
  amount = 80,
  direction = "up",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const sign = direction === "up" ? -1 : 1;
      gsap.fromTo(
        el,
        { y: sign * -amount },
        {
          y: sign * amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [amount, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
