import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: Props) {
  const cover = product.images[0];
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      aria-label={product.title}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-paper-deep/40 border border-line">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-paper-deep to-ochre/20" />
        )}
        {product.compareAtUsd && product.compareAtUsd > product.priceUsd && (
          <div className="absolute top-3 left-3 bg-ink text-paper text-[10px] uppercase tracking-widest px-2 py-1">
            Sale
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-lg leading-tight truncate group-hover:text-terracotta transition-colors">
            {product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim()}
          </div>
          {product.subtitle && (
            <div className="text-xs uppercase tracking-widest text-ink-muted mt-1">
              {product.subtitle}
            </div>
          )}
        </div>
        <div className="text-sm shrink-0 text-ink-soft tabular-nums">
          {formatPrice(product.priceUsd, "USD")}
        </div>
      </div>
    </Link>
  );
}
