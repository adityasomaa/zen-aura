"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: "button";
  strength?: number;
  children: React.ReactNode;
}
interface LinkProps {
  as: "a";
  href: string;
  strength?: number;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

type MagneticProps = Props | LinkProps;

/**
 * A button/link whose center gently follows the cursor when hovered.
 */
export function MagneticButton(props: MagneticProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const strength = "strength" in props ? props.strength ?? 0.4 : 0.4;

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    let yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    let txTo = gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" });
    let tyTo = gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" });

    function move(e: Event) {
      const ev = e as MouseEvent;
      const rect = el!.getBoundingClientRect();
      const dx = ev.clientX - (rect.left + rect.width / 2);
      const dy = ev.clientY - (rect.top + rect.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      txTo(dx * strength * 0.6);
      tyTo(dy * strength * 0.6);
    }
    function leave() {
      xTo(0); yTo(0); txTo(0); tyTo(0);
    }
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);

  const { children, ...rest } = props as { children: React.ReactNode } & Record<string, unknown>;
  delete (rest as Record<string, unknown>).strength;
  delete (rest as Record<string, unknown>).as;

  if (props.as === "a") {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <span ref={innerRef} className="inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span ref={innerRef} className="inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
