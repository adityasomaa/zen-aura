export const metadata = {
  title: "Terms & Conditions",
  description: "The terms governing your use of zenaura-bali.com.",
};

export default function TermsPage() {
  return (
    <article className="container-narrow py-20">
      <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-6">
        Legal
      </div>
      <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight">
        Terms &amp; conditions
      </h1>

      <div className="mt-12 space-y-6 text-ink-soft leading-relaxed max-w-2xl">
        <p>
          By accessing and using the ZenAura Bali website, you agree to be bound
          by these Terms and Conditions.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">Products</h2>
        <p>
          All products are offered subject to availability and described as
          accurately as possible. As many items are handcrafted, slight
          variations may occur and are considered part of their unique
          character.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">Pricing</h2>
        <p>
          Prices are listed in the selected currency and may be subject to
          change without notice. ZenAura reserves the right to refuse or cancel
          any order at its discretion, including cases of suspected fraud or
          incorrect pricing.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">Shipping</h2>
        <p>
          Customers are responsible for providing accurate shipping information.
          ZenAura cannot be held liable for delays, losses, or additional
          charges resulting from customs procedures or third-party carriers.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">
          Intellectual property
        </h2>
        <p>
          All website content, imagery, and designs remain the intellectual
          property of ZenAura Bali and may not be reproduced without permission.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">Contact</h2>
        <p>
          For questions about these terms, reach us at{" "}
          <a
            href="https://instagram.com/zenaura_bali"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            @zenaura_bali on Instagram
          </a>
          .
        </p>
      </div>
    </article>
  );
}
