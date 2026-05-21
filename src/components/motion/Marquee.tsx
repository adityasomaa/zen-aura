interface Props {
  items: string[];
  /** Repeats the items N times so the loop is seamless on wide screens. */
  loops?: number;
  className?: string;
  itemClassName?: string;
}

export function Marquee({
  items,
  loops = 4,
  className,
  itemClassName,
}: Props) {
  const all = Array.from({ length: loops }, () => items).flat();
  return (
    <div className={`marquee py-6 ${className ?? ""}`}>
      <div className="marquee__track">
        {all.map((t, i) => (
          <span key={i} className={`flex items-center gap-16 ${itemClassName ?? ""}`}>
            <span>{t}</span>
            <span aria-hidden="true" className="text-gold/60">✦</span>
          </span>
        ))}
      </div>
      <div className="marquee__track" aria-hidden="true">
        {all.map((t, i) => (
          <span key={`b-${i}`} className={`flex items-center gap-16 ${itemClassName ?? ""}`}>
            <span>{t}</span>
            <span className="text-gold/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
