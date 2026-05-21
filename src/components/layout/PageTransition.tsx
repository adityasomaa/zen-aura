"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "hidden" | "showing";

/**
 * Fade-only transition. Two roles:
 *  1. Initial-load splash — renders covering the viewport on first paint,
 *     fades out once the document is ready.
 *  2. Per-route fade — when pathname changes, fades in, briefly holds,
 *     then fades back out.
 *
 * No logo image — wordmark only, in Fraunces italic.
 */
export function PageTransition() {
  const pathname = usePathname();
  const firstRun = useRef(true);
  const [phase, setPhase] = useState<Phase>("showing");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (firstRun.current) {
      firstRun.current = false;
      // Initial splash — fade out once the document is ready
      const exit = () => {
        const t = setTimeout(() => setPhase("hidden"), 350);
        timers.push(t);
      };
      if (typeof document !== "undefined" && document.readyState === "complete") {
        exit();
      } else if (typeof window !== "undefined") {
        window.addEventListener("load", exit, { once: true });
      }
    } else {
      // Subsequent navigation — fade in, hold, fade out
      setPhase("showing");
      const t = setTimeout(() => setPhase("hidden"), 480);
      timers.push(t);
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pathname]);

  const shown = phase === "showing";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[10000] bg-midnight flex items-center justify-center"
      style={{
        opacity: shown ? 1 : 0,
        visibility: shown ? "visible" : "hidden",
        transition:
          "opacity 420ms cubic-bezier(0.4, 0, 0.2, 1), visibility 0s linear " +
          (shown ? "0s" : "420ms"),
        pointerEvents: shown ? "none" : "none",
        willChange: "opacity",
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
      </div>
    </div>
  );
}
