import Link from "next/link";

export const metadata = {
  title: "Contact Us",
  description:
    "Reach the ZenAura Bali team — Instagram, WhatsApp, or in person at our Ubud store.",
};

export default function ContactPage() {
  return (
    <article className="container-wide py-20 md:py-28">
      <div className="text-[11px] uppercase tracking-[0.28em] text-gold/70 mb-5 flex items-center gap-3">
        <span className="w-8 h-px bg-gold/40" />
        We&rsquo;d love to hear from you
      </div>
      <h1 className="font-display text-cream text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
        Wander in or message us — <em className="italic text-gold">we&rsquo;ll answer.</em>
      </h1>
      <p className="mt-6 italic text-cream-deep/80 max-w-2xl">
        Supporting talented family-run craftswomen &amp; craftsmen throughout
        Bali &amp; Java.
      </p>

      <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl">
        {/* INSTAGRAM */}
        <a
          href="https://instagram.com/zenaura_bali"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="group block bg-eggplant-deep border border-violet rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-500 hover:border-gold"
        >
          <div className="flex items-center gap-3 text-gold mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            <span className="text-[11px] uppercase tracking-[0.24em] text-gold/70">Instagram</span>
          </div>
          <div className="font-display text-cream text-2xl md:text-3xl group-hover:text-gold transition-colors">
            @zenaura_bali
          </div>
          <p className="mt-3 text-sm text-cream-deep leading-relaxed">
            DMs are the fastest way to reach us. New drops, behind-the-scenes
            from the Ubud workshop, and reels of pieces in motion.
          </p>
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/6287703592240"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="group block bg-eggplant-deep border border-violet rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-500 hover:border-gold"
        >
          <div className="flex items-center gap-3 text-gold mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20.5 12a8.5 8.5 0 1 1-3.7-7L20 4l-1 3.3A8.45 8.45 0 0 1 20.5 12Z" />
              <path d="M8 11.5c.5 1.5 2 3 3.5 3.5l1-1c.3-.3.8-.4 1.2-.2l2.3 1c.4.2.6.6.5 1L16 16.5a1.5 1.5 0 0 1-1.6 1c-2.3-.1-7.3-2.6-8.5-7.7A1.5 1.5 0 0 1 7 8l1-.5c.4-.1.8.1 1 .5l1 2.3c.2.4.1.9-.2 1.2l-1 1Z" />
            </svg>
            <span className="text-[11px] uppercase tracking-[0.24em] text-gold/70">WhatsApp</span>
          </div>
          <div className="font-display text-cream text-2xl md:text-3xl group-hover:text-gold transition-colors">
            +62 877 0359 2240
          </div>
          <p className="mt-3 text-sm text-cream-deep leading-relaxed">
            For orders, custom pieces, shipping queries, or wholesale enquiries.
            Replies typically within 24 hours, Bali time.
          </p>
        </a>

        {/* STORE */}
        <div className="bg-eggplant-deep border border-violet rounded-3xl p-8">
          <div className="flex items-center gap-3 text-gold mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 9l1.5-4.5A1 1 0 0 1 5.5 4h13a1 1 0 0 1 1 .5L21 9" />
              <path d="M3 9v11h18V9" />
              <path d="M3 9h18" />
              <path d="M8 14h8" />
            </svg>
            <span className="text-[11px] uppercase tracking-[0.24em] text-gold/70">ZenAura Bali Store</span>
          </div>
          <div className="font-display text-cream text-xl md:text-2xl">
            In the heart of Ubud
          </div>
          <p className="mt-3 text-sm text-cream-deep leading-relaxed">
            We&rsquo;re curating a small physical space in Ubud — pieces hung
            by colourway, candles burning, and tea on the table. Drop us a DM
            to schedule a visit while we finalise opening hours.
          </p>
        </div>

        {/* WAREHOUSE */}
        <div className="bg-eggplant-deep border border-violet rounded-3xl p-8">
          <div className="flex items-center gap-3 text-gold mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 9V20h18V9" />
              <path d="M3 9l9-6 9 6" />
              <path d="M9 20v-6h6v6" />
            </svg>
            <span className="text-[11px] uppercase tracking-[0.24em] text-gold/70">ZenAura Bali Warehouse</span>
          </div>
          <div className="font-display text-cream text-xl md:text-2xl">
            Fulfilment &amp; shipping
          </div>
          <p className="mt-3 text-sm text-cream-deep leading-relaxed">
            All orders are quality-checked and packed by the same hands that
            crafted them. Worldwide shipping via DHL — see our{" "}
            <Link
              href="/shipping"
              className="underline decoration-gold/40 underline-offset-2 hover:text-gold"
              data-cursor="link"
            >
              shipping page
            </Link>{" "}
            for transit times.
          </p>
        </div>
      </div>

      <div className="mt-16 max-w-2xl rule pt-8">
        <p className="text-sm text-cream-deep">
          For media, press, or collaboration enquiries, please mention
          &ldquo;Press / Collab&rdquo; in your first message and we&rsquo;ll
          route you to the right person.
        </p>
      </div>
    </article>
  );
}
