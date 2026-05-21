export const metadata = {
  title: "About",
  description:
    "ZenAura Bali — a bohemian boutique in Ubud, collaborating with Balinese artisans to make handcrafted fashion, jewelry, and spiritual treasures.",
};

export default function AboutPage() {
  return (
    <article className="container-narrow py-20 md:py-32">
      <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-6">
        Our story
      </div>
      <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
        Born of <em className="italic text-terracotta">creativity,</em>
        <br /> community, and the magical spirit of Bali.
      </h1>

      <div className="mt-12 space-y-6 text-lg leading-relaxed text-ink-soft max-w-2xl">
        <p>
          ZenAura is more than a boutique — it is a living collaboration between
          visionary curators and incredibly talented local artisans, rooted in
          the spiritual heart of Ubud.
        </p>
        <p>
          Working hand-in-hand with Balinese craftsmen and women, we are
          dedicated to preserving traditional skills while giving them space to
          evolve in contemporary, expressive ways. Each piece is thoughtfully
          designed, ethically sourced, and lovingly handcrafted — carrying the
          energy, intention, and story of the hands that made it.
        </p>
        <p>
          We exist to celebrate individuality, empower local communities, and
          offer wearable treasures that resonate far beyond fashion.
        </p>
      </div>

      <div className="mt-20 rule pt-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-display text-2xl mb-2">Handcrafted</div>
          <p className="text-ink-soft">
            Every piece is made by hand in Ubud, Bali. No machines, no
            shortcuts. Slight variations are part of their character.
          </p>
        </div>
        <div>
          <div className="font-display text-2xl mb-2">Ethical</div>
          <p className="text-ink-soft">
            Long-term partnerships with the same artisan families. Fair wages,
            natural fibres, no rushed production.
          </p>
        </div>
        <div>
          <div className="font-display text-2xl mb-2">Soulful</div>
          <p className="text-ink-soft">
            Cosmic creations for divine beings. Pieces designed to be worn with
            intention.
          </p>
        </div>
      </div>
    </article>
  );
}
