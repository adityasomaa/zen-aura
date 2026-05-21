"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Choice = "all" | "essential";

const STORAGE_KEY = "zen-cookie-consent";

/**
 * Minimal cookies banner. Shows on first visit, persists choice in
 * localStorage so it never re-appears for that visitor.
 *
 * Choice is exposed via window.dispatchEvent('zen-cookie-consent', {detail}).
 * Analytics/marketing scripts should listen for this and only load when the
 * `all` choice is recorded.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    // Show shortly after the page transition fades so it doesn't compete.
    const t = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  function decide(choice: Choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(
      new CustomEvent("zen-cookie-consent", { detail: { choice } }),
    );
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[9400]"
    >
      <div className="bg-eggplant border border-violet rounded-2xl p-5 md:p-6 shadow-[0_25px_80px_-30px_rgba(238,217,119,0.25)] backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="mt-1 w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0"
          >
            <span className="block w-2 h-2 rounded-full bg-gold" />
          </div>
          <div>
            <h3
              id="cookie-title"
              className="font-display text-cream text-lg leading-tight"
            >
              A little cosmic dust.
            </h3>
            <p className="mt-1.5 text-[13px] text-cream-deep leading-relaxed">
              We use essential cookies to make the site work and (with your
              permission) a few more to learn how you wander the collection.
              Read our{" "}
              <Link
                href="/privacy"
                className="underline decoration-gold/40 underline-offset-2 hover:text-gold"
                data-cursor="link"
              >
                privacy policy
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => decide("essential")}
                className="text-[12px] uppercase tracking-[0.18em] text-cream-deep hover:text-gold border border-violet rounded-full px-4 py-2 transition-colors"
                data-cursor="link"
              >
                Essential only
              </button>
              <button
                onClick={() => decide("all")}
                className="text-[12px] uppercase tracking-[0.18em] text-midnight bg-gold hover:bg-gold-bright rounded-full px-4 py-2 transition-colors"
                data-cursor="link"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
