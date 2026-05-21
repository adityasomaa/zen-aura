"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Stage = "form" | "success";
type Channel = "whatsapp" | "email";

/**
 * First-visit welcome offer.
 *
 *  • Asks for WhatsApp number (preferred) or email.
 *  • Reveals after a brief delay so users see the hero first.
 *  • Persists `zen-welcome-seen` in localStorage so it never re-appears.
 *  • Includes ESC + backdrop close + magnetic glow CTA.
 *
 * Offer copy mirrors the client brief on 14 Dec:
 *  10% off first purchase, +15% off when spending £145 / $195.
 */
export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("form");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (localStorage.getItem("zen-welcome-seen") === "1") return;
    const t = window.setTimeout(() => setOpen(true), 6500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open || !cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 24, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  function close() {
    if (!cardRef.current) {
      setOpen(false);
      localStorage.setItem("zen-welcome-seen", "1");
      return;
    }
    gsap.to(cardRef.current, {
      autoAlpha: 0,
      y: 12,
      scale: 0.98,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setOpen(false);
        localStorage.setItem("zen-welcome-seen", "1");
      },
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = value.trim();
    if (channel === "email") {
      if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
        setError("Please enter a valid email address.");
        return;
      }
    } else {
      // Loose phone validation — at least 8 digits
      const digits = trimmed.replace(/[^\d]/g, "");
      if (digits.length < 8) {
        setError("Please enter a valid WhatsApp number.");
        return;
      }
    }
    // TODO: POST to /api/newsletter when Resend is wired up.
    setCode("ZENWELCOME10");
    setStage("success");
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="fixed inset-0 z-[9500] flex items-center justify-center p-5"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-midnight/80 backdrop-blur-md"
      />
      <div
        ref={cardRef}
        className="relative max-w-lg w-full bg-eggplant border border-violet rounded-3xl overflow-hidden shadow-[0_30px_120px_-30px_rgba(238,217,119,0.35)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-24 starfield opacity-50 pointer-events-none"
        />
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full text-cream-deep hover:text-gold hover:bg-violet/60 transition-colors flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 6l12 12M18 6l-6 12" />
          </svg>
        </button>

        {stage === "form" ? (
          <div className="relative p-8 md:p-10">
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold/70 mb-3">
              An invitation
            </div>
            <h2
              id="welcome-title"
              className="font-display text-cream text-3xl md:text-4xl leading-[1.05] tracking-tight"
            >
              <em className="italic text-gold">10% off</em> your first
              treasure.
            </h2>
            <p className="mt-3 text-sm text-cream-deep leading-relaxed">
              Plus an additional{" "}
              <span className="text-gold">15% off when you spend over $195</span>{" "}
              <span className="text-cream-deep">(£145).</span> Drop your details
              and we&rsquo;ll send your code instantly.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-violet text-xs overflow-hidden">
              {(["whatsapp", "email"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setChannel(c);
                    setValue("");
                    setError(null);
                  }}
                  className={`px-3.5 py-1.5 tracking-wider uppercase transition-colors ${
                    channel === c
                      ? "bg-gold text-midnight"
                      : "text-cream-deep hover:text-gold"
                  }`}
                  data-cursor="link"
                >
                  {c === "whatsapp" ? "WhatsApp" : "Email"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-5">
              <label className="block text-[11px] uppercase tracking-[0.22em] text-cream-deep mb-2">
                {channel === "whatsapp" ? "WhatsApp number" : "Email address"}
              </label>
              <input
                type={channel === "whatsapp" ? "tel" : "email"}
                inputMode={channel === "whatsapp" ? "tel" : "email"}
                placeholder={
                  channel === "whatsapp"
                    ? "+62 812 3456 7890"
                    : "you@yourdomain.com"
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="w-full bg-transparent border-b border-violet focus:border-gold py-2.5 text-cream placeholder:text-cream-deep/40 focus:outline-none transition-colors"
                autoFocus
              />
              {error && (
                <div className="mt-2 text-xs text-rose">{error}</div>
              )}
              <button
                type="submit"
                className="btn-gold mt-6 w-full"
                data-cursor="link"
              >
                Send my 10% off code
              </button>
              <button
                type="button"
                onClick={close}
                className="block mx-auto mt-4 text-xs uppercase tracking-[0.22em] text-cream-deep/60 hover:text-cream transition-colors"
              >
                Maybe later
              </button>
            </form>
          </div>
        ) : (
          <div className="relative p-10 md:p-12 text-center">
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold/70 mb-3">
              Welcome to the orbit
            </div>
            <h2 className="font-display text-cream text-3xl md:text-4xl leading-[1.1]">
              Your code is <em className="italic text-gold">{code}</em>
            </h2>
            <p className="mt-4 text-sm text-cream-deep leading-relaxed">
              Apply it at checkout for 10% off your first purchase. Use it
              alongside our 15% off tier at $195 / £145.
            </p>
            <button
              type="button"
              onClick={close}
              className="btn-gold mt-7"
              data-cursor="link"
            >
              Start shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
