"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";

interface Props {
  children: string;
  as?: HeadingTag;
  className?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Stagger between words (seconds) */
  stagger?: number;
  /** Trigger on scroll (default) or immediately on mount */
  trigger?: "scroll" | "mount";
}

/**
 * Splits text into word spans and reveals them with a stagger.
 * Cheap and avoids the paid GSAP SplitText plugin.
 */
export function SplitReveal({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.04,
  trigger = "scroll",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const words = el.querySelectorAll<HTMLSpanElement>(".word");

    const ctx = gsap.context(() => {
      gsap.set(words, { autoAlpha: 0, y: "100%" });
      const animation = gsap.to(words, {
        autoAlpha: 1,
        y: "0%",
        duration: 1.1,
        ease: "power3.out",
        stagger,
        delay,
        scrollTrigger:
          trigger === "scroll"
            ? {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse",
              }
            : undefined,
      });
      return animation;
    }, el);
    return () => ctx.revert();
  }, [delay, stagger, trigger]);

  // Word-level split that preserves HTML entity rendering of any italic <em>
  const parts = children.split(/(\s+)/);
  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={className}
      style={{ display: "block", overflow: "hidden" }}
    >
      {parts.map((p, i) =>
        p.match(/^\s+$/) ? (
          <span key={i}>{p}</span>
        ) : (
          <span key={i} className="inline-block overflow-hidden align-baseline">
            <span className="word inline-block will-change-transform">{p}</span>
          </span>
        ),
      )}
    </Component>
  );
}
