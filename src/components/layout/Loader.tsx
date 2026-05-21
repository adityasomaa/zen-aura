"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Splash loader. Shows logo with a glowing halo on first paint,
 * then fades out once the document is fully ready.
 * Skipped on subsequent navigations (we read sessionStorage).
 */
export function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("zen-loader-seen");
    if (seen) {
      setDone(true);
      return;
    }
    const minVisibleMs = 700;
    const start = performance.now();

    const finish = () => {
      const elapsed = performance.now() - start;
      const delay = Math.max(0, minVisibleMs - elapsed);
      window.setTimeout(() => {
        sessionStorage.setItem("zen-loader-seen", "1");
        setDone(true);
      }, delay);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="zen-loader transition-opacity duration-700"
      style={{
        opacity: done ? 0 : 1,
        visibility: done ? "hidden" : "visible",
      }}
    >
      <div className="zen-loader__halo" />
      <div className="relative w-[140px] h-[140px] z-10">
        <Image
          src="/brand/logo.jpg"
          alt="ZenAura Bali"
          fill
          priority
          sizes="140px"
          className="rounded-full object-cover"
        />
      </div>
    </div>
  );
}
