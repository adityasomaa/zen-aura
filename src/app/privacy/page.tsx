import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How ZenAura Bali collects, uses, and protects your personal information — including our use of cookies.",
};

const SECTIONS = [
  {
    h: "What we collect",
    p: [
      "When you place an order or subscribe to our newsletter, we collect the information you give us — name, email address, WhatsApp number, shipping address, and the items in your order.",
      "Payments are processed by Stripe (USD) and Xendit (IDR). We never see or store your full card number, CVV, or bank details — only a confirmation of the transaction.",
    ],
  },
  {
    h: "Cookies",
    p: [
      "Essential cookies (the ones that keep your cart, currency choice, and checkout session working) are always on — without them the site cannot function.",
      "Analytics and marketing cookies only run if you tap “Accept all” in the cookies banner. You can revoke that at any time by clearing your browser storage. We do not sell or rent any cookie-derived data.",
    ],
  },
  {
    h: "How we use your information",
    p: [
      "To fulfil your order, send transactional updates (order confirmation, shipping notification), and — only if you opt in — share news about new arrivals and limited drops.",
      "We will never use your data for anything you did not explicitly agree to.",
    ],
  },
  {
    h: "Who we share it with",
    p: [
      "We share only what is strictly necessary, with:",
      "• Shipping carriers (primarily DHL) to deliver your order.",
      "• Payment processors (Stripe, Xendit) to complete payment.",
      "• Email service (Resend) to send your order confirmation.",
      "• Hosting infrastructure (Vercel) to serve the site.",
      "We never sell your data to advertisers or third parties.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "You can request a copy of the data we hold about you, ask us to correct it, or ask us to delete it entirely, at any time. Reach us via Instagram or email and we will respond within 14 days.",
    ],
  },
  {
    h: "Security",
    p: [
      "All traffic to and from the site is encrypted (HTTPS/TLS). Payment data is handled exclusively by PCI-DSS compliant providers. We follow current industry practice for storing what little personal data we do keep.",
    ],
  },
  {
    h: "Contact",
    p: [
      "For any privacy question or request, reach us on Instagram",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <article className="container-narrow py-20 md:py-28">
      <div className="text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-5 flex items-center gap-3">
        <span className="w-8 h-px bg-gold/40" />
        Legal · Last updated 21 May 2026
      </div>
      <h1 className="font-display text-cream text-4xl md:text-6xl leading-[1.05] tracking-tight">
        Privacy <em className="italic text-gold">policy.</em>
      </h1>
      <p className="mt-6 italic text-cream-deep/80 max-w-2xl">
        ZenAura Bali respects your privacy. This page explains, in plain
        language, what we collect, why, and the choices you have.
      </p>

      <div className="mt-12 space-y-10 max-w-2xl">
        {SECTIONS.map((s, i) => (
          <section key={i}>
            <h2 className="font-display text-2xl md:text-3xl text-cream tracking-tight">
              {s.h}
            </h2>
            <div className="mt-3 space-y-3 text-cream-deep leading-relaxed">
              {s.p.map((line, j) => (
                <p key={j} className="whitespace-pre-line">
                  {line}
                </p>
              ))}
              {s.h === "Contact" && (
                <p>
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
                    href="/terms"
                    className="underline decoration-gold/40 underline-offset-2 hover:text-gold"
                    data-cursor="link"
                  >
                    terms of use
                  </Link>
                  .
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
