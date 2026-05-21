"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/admin/orders";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".login-card",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.15 },
      );
      gsap.fromTo(
        ".login-field",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.45,
        },
      );
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1.2, ease: "power2.out" },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Sign-in failed");
        setBusy(false);
        if (formRef.current) {
          gsap.fromTo(
            formRef.current,
            { x: -8 },
            { x: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" },
          );
        }
        return;
      }
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setBusy(false);
    }
  }

  return (
    <section
      className="min-h-screen grid lg:grid-cols-2 bg-midnight text-cream relative overflow-hidden"
    >
      {/* LEFT — cosmic brand canvas */}
      <div
        ref={leftRef}
        className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 20%, rgba(105,13,172,0.45), transparent 60%), linear-gradient(135deg, #1a0b1e 0%, #301934 55%, #4a2a52 100%)",
        }}
      >
        <div aria-hidden="true" className="absolute inset-0 starfield opacity-50" />
        <div aria-hidden="true" className="absolute inset-0 grain" />

        <div className="relative flex items-center gap-3">
          <span className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-gold/40">
            <Image
              src="/brand/logo.jpg"
              alt="ZenAura Bali"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </span>
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold/70">
              ZenAura · Bali
            </div>
            <div className="font-display text-cream text-lg leading-tight">
              Curator portal
            </div>
          </div>
        </div>

        <div className="relative max-w-md">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold/70 mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-gold/40" />
            Welcome back
          </div>
          <h1 className="font-display text-cream text-5xl xl:text-6xl leading-[0.95] tracking-tight">
            Tend to the <em className="italic text-gold">cosmos.</em>
          </h1>
          <p className="mt-6 text-cream-deep text-lg leading-relaxed">
            Manage orders, monitor revenue across Stripe and Xendit, and steward
            the ZenAura collection — all from one quiet, magical place.
          </p>
        </div>

        <div className="relative">
          <p className="italic text-[12px] text-cream-deep/70 max-w-sm leading-relaxed">
            Supporting talented family-run craftswomen &amp; craftsmen throughout
            Bali &amp; Java.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-cream-deep hover:text-gold transition-colors"
          >
            ← Back to the storefront
          </Link>
        </div>
      </div>

      {/* RIGHT — form */}
      <div
        ref={formRef}
        className="relative flex items-center justify-center px-6 py-12 md:py-16"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 lg:hidden starfield opacity-20 pointer-events-none"
        />
        <div className="login-card relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <span className="relative inline-block w-14 h-14 rounded-full overflow-hidden ring-1 ring-gold/40">
              <Image
                src="/brand/logo.jpg"
                alt="ZenAura Bali"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            </span>
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold/70 mt-4">
              ZenAura · Curator
            </div>
          </div>

          <div className="login-field text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-gold/40" />
            Sign in
          </div>
          <h2 className="login-field font-display text-cream text-4xl md:text-5xl leading-[1.02] tracking-tight">
            Enter your <em className="italic text-gold">orbit.</em>
          </h2>
          <p className="login-field mt-3 text-cream-deep text-[15px] leading-relaxed">
            Authorized curators only. Sessions persist for 7 days.
          </p>

          <form onSubmit={submit} className="mt-9 space-y-5">
            <Field label="Username" delay>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                spellCheck={false}
                className="peer w-full bg-transparent border border-violet focus:border-gold rounded-full px-5 py-3.5 text-cream placeholder:text-cream-deep/40 focus:outline-none transition-colors"
                placeholder="zenaura"
              />
            </Field>

            <Field label="Password" delay>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent border border-violet focus:border-gold rounded-full px-5 py-3.5 pr-14 text-cream placeholder:text-cream-deep/40 focus:outline-none transition-colors"
                  placeholder="•••••••••••••"
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-cream-deep hover:text-gold hover:bg-violet/40 transition-colors flex items-center justify-center"
                >
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 6.1a10.5 10.5 0 0 1 1.4-.1c6 0 10 6 10 6a17.5 17.5 0 0 1-3.7 4.4M6.6 6.6A17.5 17.5 0 0 0 2 12s4 6 10 6a9.6 9.6 0 0 0 5.4-1.6" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </Field>

            {error && (
              <div className="login-field flex items-start gap-2 text-[13px] text-rose bg-rose/10 border border-rose/30 rounded-2xl px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="mt-0.5 shrink-0" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="login-field pt-2">
              <button
                type="submit"
                disabled={busy || !username || !password}
                className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="block w-2 h-2 rounded-full bg-midnight animate-pulse" />
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="login-field rule mt-10 pt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-cream-deep/70">
            <span>Secure session · HttpOnly</span>
            <Link
              href="/"
              className="hover:text-gold transition-colors lg:hidden"
            >
              ← Storefront
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  delay,
}: {
  label: string;
  children: React.ReactNode;
  delay?: boolean;
}) {
  return (
    <label className={`block ${delay ? "login-field" : ""}`}>
      <span className="block text-[11px] uppercase tracking-[0.22em] text-cream-deep mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
