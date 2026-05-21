"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "hidden" | "showing";

/**
 * Fade transition with a wordless cosmic dot + expanding halos.
 * Two roles:
 *  1. Initial-load splash — covers viewport on first paint, fades out
 *     once the document is ready.
 *  2. Per-route fade — fades in, briefly holds, fades back out.
 */
export function PageTransition() {
  const pathname = usePathname();
  const firstRun = useRef(true);
  const [phase, setPhase] = useState<Phase>("showing");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (firstRun.current) {
      firstRun.current = false;
      const exit = () => {
        const t = setTimeout(() => setPhase("hidden"), 450);
        timers.push(t);
      };
      if (typeof document !== "undefined" && document.readyState === "complete") {
        exit();
      } else if (typeof window !== "undefined") {
        window.addEventListener("load", exit, { once: true });
      }
    } else {
      setPhase("showing");
      const t = setTimeout(() => setPhase("hidden"), 520);
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
        willChange: "opacity",
      }}
    >
      <div className="loader-orbit" aria-hidden="true">
        <span className="loader-dot" />
        <span className="loader-ring" />
        <span className="loader-ring loader-ring--delayed" />
      </div>
    </div>
  );
}
