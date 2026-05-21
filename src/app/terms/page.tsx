import Link from "next/link";

export const metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern your use of zenaura-bali.com and any purchase you make from us.",
};

const SECTIONS = [
  {
    h: "Acceptance",
    p: [
      "By accessing zenaura-bali.com you agree to be bound by these terms of use. If you do not agree, please do not use the site.",
    ],
  },
  {
    h: "The pieces",
    p: [
      "Every piece is handcrafted in Ubud, Bali. Slight variations in colour, texture, and finish are part of the character of natural fibres and the human hand — they are not defects.",
      "Stated dimensions and weights are approximate. We do our best to photograph pieces honestly; we cannot guarantee that every screen will render colour identically.",
    ],
  },
  {
    h: "Pricing & currency",
    p: [
      "Prices are shown in either US dollars or Indonesian rupiah, depending on the toggle you select. We reserve the right to correct an obvious pricing error and to cancel an affected order with a full refund.",
      "Discount codes (such as the welcome 10% code) cannot be combined with other promotions unless explicitly stated.",
    ],
  },
  {
    h: "Orders & payment",
    p: [
      "USD orders are processed by Stripe. IDR orders are processed by Xendit. We never store full payment instruments on our infrastructure.",
      "An order is considered accepted only when you receive an order confirmation email. We may decline an order at our discretion (for example, suspected fraud or impossible shipping address) and will refund any payment taken.",
    ],
  },
  {
    h: "Shipping & delivery",
    p: [
      "We ship worldwide via trusted carriers (primarily DHL). Estimated delivery times and costs are listed on our",
    ],
    contentExtra: "shipping",
  },
  {
    h: "Customs & duties",
    p: [
      "Any customs duties or import taxes levied by your country are your responsibility as the recipient. They are not included in the price or shipping cost shown at checkout.",
    ],
  },
  {
    h: "Returns",
    p: [
      "Because each piece is made to order or in very small runs, returns are accepted only for items that arrive damaged or materially different from what was described. Please reach out within 7 days of delivery via Instagram with photos.",
    ],
  },
  {
    h: "Intellectual property",
    p: [
      "All content on the site — including imagery, designs, copywriting, and the ZenAura name and motif — is owned by ZenAura Bali. You may not reproduce, distribute, or use any of it commercially without our written permission.",
    ],
  },
  {
    h: "Liability",
    p: [
      "We do our utmost to describe pieces accurately and ship safely. To the maximum extent permitted by Indonesian law, our liability to you for any claim relating to a purchase is limited to the amount you paid for the affected order.",
    ],
  },
  {
    h: "Governing law",
    p: [
      "These terms are governed by the laws of the Republic of Indonesia. Any dispute that cannot be resolved amicably will be heard by the competent courts in Bali.",
    ],
  },
  {
    h: "Changes",
    p: [
      "We may update these terms from time to time — usually to clarify wording or reflect new payment options. The version in force is the one published on this page. Material changes will be summarised at the top.",
    ],
  },
];

export default function TermsPage() {
  return (
    <article className="container-narrow py-20 md:py-28">
      <div className="text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-5 flex items-center gap-3">
        <span className="w-8 h-px bg-gold/40" />
        Legal · Last updated 21 May 2026
      </div>
      <h1 className="font-display text-cream text-4xl md:text-6xl leading-[1.05] tracking-tight">
        Terms of <em className="italic text-gold">use.</em>
      </h1>
      <p className="mt-6 italic text-cream-deep/80 max-w-2xl">
        Supporting talented family-run craftswomen &amp; craftsmen throughout
        Bali &amp; Java. These terms keep things fair for both of us.
      </p>

      <div className="mt-12 space-y-10 max-w-2xl">
        {SECTIONS.map((s, i) => (
          <section key={i}>
            <h2 className="font-display text-2xl md:text-3xl text-cream tracking-tight">
              {s.h}
            </h2>
            <div className="mt-3 space-y-3 text-cream-deep leading-relaxed">
              {s.p.map((line, j) => (
                <p key={j}>
                  {line}
                  {s.contentExtra === "shipping" && j === s.p.length - 1 && (
                    <>
                      {" "}
                      <Link
                        href="/shipping"
                        className="underline decoration-gold/40 underline-offset-2 hover:text-gold"
                        data-cursor="link"
                      >
                        shipping page
                      </Link>
                      . Once your order has shipped, you will receive a
                      tracking link.
                    </>
                  )}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section className="rule pt-8">
          <p className="text-sm text-cream-deep/80">
            Questions? Reach us at{" "}
            <a
              href="https://instagram.com/zenaura_bali"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-gold/40 underline-offset-2 hover:text-gold"
              data-cursor="link"
            >
              @zenaura_bali
            </a>{" "}
            · or read our{" "}
            <Link
              href="/privacy"
              className="underline decoration-gold/40 underline-offset-2 hover:text-gold"
              data-cursor="link"
            >
              privacy policy
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
