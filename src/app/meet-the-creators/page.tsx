export const metadata = {
  title: "Meet the Creators",
  description:
    "ZenAura is a collective of passionate souls collaborating with Balinese artisans in Ubud.",
};

export default function MeetTheCreatorsPage() {
  return (
    <article className="container-narrow py-20 md:py-32">
      <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-6">
        The collective
      </div>
      <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
        Meet the <em className="italic text-terracotta">creators.</em>
      </h1>

      <div className="mt-12 space-y-6 text-lg leading-relaxed text-ink-soft max-w-2xl">
        <p>
          ZenAura was born from a shared love of creativity, community, and the
          magical spirit of Bali. Founded by a collective of passionate souls,
          we are more than a boutique — we are a living collaboration between
          visionary curators and incredibly talented local artisans.
        </p>
        <p>
          Working hand-in-hand with Balinese craftsmen and women, the creators
          of ZenAura are dedicated to preserving traditional skills while giving
          them space to evolve in contemporary, expressive ways.
        </p>
        <p>
          Each piece is thoughtfully designed, ethically sourced, and lovingly
          handcrafted, carrying the energy, intention, and story of the hands
          that made it.
        </p>
        <p>
          Rooted in Ubud&rsquo;s spiritual heart, ZenAura exists to celebrate
          individuality, empower local communities, and offer wearable treasures
          that resonate far beyond fashion.
        </p>
      </div>
    </article>
  );
}
