"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "below" | "covering" | "above";

/**
 * Handles two roles:
 *  1. Initial-load splash — renders covering the viewport on first paint,
 *     then slides up off-screen once the document is ready.
 *  2. Per-route curtain — when pathname changes, the panel slides up from
 *     below, briefly covers the viewport, then slides up off-screen.
 *
 * No logo image — the wordmark is set in Fraunces italic with a thin
 * gold rule underneath. Matches the rest of the type system.
 */
export function PageTransition() {
  const pathname = usePathname();
  const firstRun = useRef(true);
  const [phase, setPhase] = useState<Phase>("covering");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (firstRun.current) {
      firstRun.current = false;
      // Initial splash — exit upward once the document is ready
      const exit = () => {
        const t = setTimeout(() => setPhase("above"), 350);
        timers.push(t);
      };
      if (typeof document !== "undefined" && document.readyState === "complete") {
        exit();
      } else if (typeof window !== "undefined") {
        window.addEventListener("load", exit, { once: true });
      }
    } else {
      // Subsequent navigation — sweep in from below, briefly cover, sweep up
      setPhase("below");
      // Use rAF to ensure the "below" phase paints before we transition
      const raf = requestAnimationFrame(() => {
        const t1 = setTimeout(() => setPhase("covering"), 30);
        const t2 = setTimeout(() => setPhase("above"), 520);
        timers.push(t1, t2);
      });
      timers.push(raf as unknown as ReturnType<typeof setTimeout>);
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pathname]);

  const translate =
    phase === "below"
      ? "translate3d(0, 100%, 0)"
      : phase === "above"
        ? "translate3d(0, -100%, 0)"
        : "translate3d(0, 0, 0)";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[10000] pointer-events-none bg-midnight flex items-center justify-center"
      style={{
        transform: translate,
        transition: "transform 480ms cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
      }}
    >
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.35em] text-gold/60 mb-3">
          ZenAura · Bali
        </div>
        <div className="flex items-center gap-5 justify-center">
          <span className="hidden md:block w-16 h-px bg-gold/40" />
          <div className="font-display italic text-gold text-4xl md:text-6xl leading-none tracking-tight">
            Cosmic creations
          </div>
          <span className="hidden md:block w-16 h-px bg-gold/40" />
        </div>
        <div className="mt-3 mx-auto w-40 h-px bg-gold/40 overflow-hidden relative">
          <span
            className="absolute inset-y-0 left-0 bg-gold"
            style={{
              width: phase === "covering" ? "100%" : "0%",
              transition: phase === "covering" ? "width 700ms ease-out" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
