export const metadata = {
  title: "Shipping",
  description: "Worldwide shipping with DHL. Estimated delivery times and costs.",
};

export default function ShippingPage() {
  return (
    <article className="container-narrow py-20">
      <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-6">
        Shipping &amp; delivery
      </div>
      <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight">
        Worldwide, with care.
      </h1>

      <div className="mt-12 prose-content space-y-6 text-ink-soft leading-relaxed max-w-2xl">
        <p>
          We offer worldwide shipping via trusted carriers like DHL. Each order
          is quality checked before packaging, carefully prepared and packaged
          with good intentions.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">Processing</h2>
        <p>
          Orders are typically processed within 3–7 business days before
          dispatch.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">
          Estimated delivery
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm font-sans">
          <div className="flex justify-between border-b border-line py-2">
            <span>USA</span>
            <span className="text-ink-muted">7–25 business days</span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span>Europe</span>
            <span className="text-ink-muted">7–20 business days</span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span>United Kingdom</span>
            <span className="text-ink-muted">7–20 business days</span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span>Indonesia / Asia</span>
            <span className="text-ink-muted">5–10 business days</span>
          </div>
        </div>

        <h2 className="font-display text-2xl text-ink mt-10">Shipping costs</h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm font-sans">
          <div className="flex justify-between border-b border-line py-2">
            <span>USA</span>
            <span className="text-ink-muted">from $47</span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span>Europe</span>
            <span className="text-ink-muted">from €39</span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span>United Kingdom</span>
            <span className="text-ink-muted">from £34</span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span>Indonesia / Asia</span>
            <span className="text-ink-muted">from Rp 500</span>
          </div>
        </div>

        <h2 className="font-display text-2xl text-ink mt-10">Tracking</h2>
        <p>
          Once your order has shipped, you&rsquo;ll receive a confirmation email
          with tracking details so you can follow your parcel every step of the
          way.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">
          Customs &amp; duties
        </h2>
        <p>
          Customs duties or import taxes may apply and are the responsibility of
          the customer.
        </p>
      </div>
    </article>
  );
}
