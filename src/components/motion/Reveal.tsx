"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Direction = "up" | "down" | "left" | "right" | "scale";

interface Props {
  children: React.ReactNode;
  /** Stagger delay between children (selector ".reveal-item") in seconds */
  stagger?: number;
  /** Direction of entry */
  direction?: Direction;
  /** Distance in px (or scale ratio when direction === "scale") */
  distance?: number;
  /** Delay before first item starts */
  delay?: number;
  /** Custom selector inside this container (default: ".reveal-item") */
  selector?: string;
  className?: string;
}

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    case "scale":
      return { scale: 0.94 };
  }
}

export function Reveal({
  children,
  stagger = 0.08,
  direction = "up",
  distance = 28,
  delay = 0,
  selector = ".reveal-item",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const items = el.querySelectorAll<HTMLElement>(selector);
    const targets = items.length ? Array.from(items) : [el];
    const from = { autoAlpha: 0, ...offsetFor(direction, distance) };

    const ctx = gsap.context(() => {
      gsap.set(targets, from);
      gsap.to(targets, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [direction, distance, stagger, delay, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
