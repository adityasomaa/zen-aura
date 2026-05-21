"use client";

import { useEffect, useRef } from "react";

/**
 * Soft gold cursor dot that expands over interactive elements.
 * Disabled on coarse pointers via CSS.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    function tick() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (el) el.dataset.state = "default";
    }
    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive = target?.closest?.(
        "a, button, [data-cursor='link'], input, textarea, select, [role='button']",
      );
      if (el) el.dataset.state = interactive ? "link" : "default";
    }
    function onLeave() {
      if (el) el.dataset.state = "hidden";
    }
    function onEnter() {
      if (el) el.dataset.state = "default";
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
