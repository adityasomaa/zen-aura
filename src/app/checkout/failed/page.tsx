import Link from "next/link";

export const metadata = {
  title: "Payment unsuccessful",
};

export default function FailedPage() {
  return (
    <section className="container-narrow py-24 md:py-32 text-center">
      <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-6">
        Payment unsuccessful
      </div>
      <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
        Let&rsquo;s try again.
      </h1>
      <p className="mt-8 text-lg text-ink-soft max-w-xl mx-auto leading-relaxed">
        Your payment didn&rsquo;t go through. Nothing has been charged. You can
        return to your cart and try a different method, or reach out via
        Instagram if the issue persists.
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link
          href="/cart"
          className="inline-flex items-center bg-ink text-paper px-6 py-3 text-sm uppercase tracking-widest hover:bg-terracotta transition-colors"
        >
          Back to cart
        </Link>
        <a
          href="https://instagram.com/zenaura_bali"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center border border-ink px-6 py-3 text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
        >
          Contact us
        </a>
      </div>
    </section>
  );
}
