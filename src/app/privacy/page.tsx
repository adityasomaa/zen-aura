export const metadata = {
  title: "Privacy Policy",
  description: "How ZenAura Bali collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <article className="container-narrow py-20">
      <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-6">
        Legal
      </div>
      <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight">
        Privacy policy
      </h1>

      <div className="mt-12 space-y-6 text-ink-soft leading-relaxed max-w-2xl">
        <p>
          ZenAura Bali respects your privacy. This policy describes what
          information we collect, how we use it, and the choices you have.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">
          What we collect
        </h2>
        <p>
          When you place an order or subscribe to our newsletter, we collect
          your name, email, shipping address, and payment details (processed
          securely by Stripe and Xendit — we never store full card numbers).
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">How we use it</h2>
        <p>
          We use your information solely to fulfill orders, send transactional
          updates, and — if you opt in — share news about new arrivals.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">Sharing</h2>
        <p>
          We never sell your data. We share only what is necessary with
          shipping carriers (DHL) and payment processors (Stripe, Xendit) to
          complete your order.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">Your rights</h2>
        <p>
          You can request access to, correction of, or deletion of your data at
          any time by reaching us via Instagram{" "}
          <a
            href="https://instagram.com/zenaura_bali"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            @zenaura_bali
          </a>
          .
        </p>
      </div>
    </article>
  );
}
