"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

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

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Sign-in failed");
        setBusy(false);
        return;
      }
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setBusy(false);
    }
  }

  return (
    <section className="container-narrow py-24 md:py-32">
      <div className="max-w-md mx-auto bg-eggplant border border-violet rounded-3xl p-8 md:p-10">
        <div className="text-[10px] uppercase tracking-[0.32em] text-gold/70 mb-3">
          Admin · Sign in
        </div>
        <h1 className="font-display text-cream text-3xl md:text-4xl tracking-tight">
          Enter your <em className="italic text-gold">admin password.</em>
        </h1>
        <form onSubmit={submit} className="mt-8">
          <label className="block text-[11px] uppercase tracking-[0.22em] text-cream-deep mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full bg-transparent border-b border-violet focus:border-gold py-2.5 text-cream placeholder:text-cream-deep/40 focus:outline-none transition-colors"
            placeholder="Your ADMIN_SECRET"
          />
          {error && <div className="mt-2 text-xs text-rose">{error}</div>}
          <button
            type="submit"
            disabled={busy}
            className="btn-gold mt-6 w-full disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-[11px] text-cream-deep/70 leading-relaxed">
          Password is the <code className="text-gold">ADMIN_SECRET</code> env
          var configured in Vercel. Sets an HttpOnly cookie for 7 days.
        </p>
      </div>
    </section>
  );
}
