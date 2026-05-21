import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCardPrice } from "./ProductCardPrice";

interface Props {
  product: Product;
  priority?: boolean;
  /** Aspect ratio class — defaults to portrait. */
  aspect?: string;
}

export function ProductCard({
  product,
  priority,
  aspect = "aspect-[3/4]",
}: Props) {
  const front = product.images[0];
  const back = product.images[1] ?? product.images[0];
  const cleanTitle = product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      aria-label={cleanTitle}
      data-cursor="link"
    >
      <div
        className={`peek-card relative ${aspect} overflow-hidden rounded-[28px] ring-1 ring-violet bg-violet`}
      >
        {front && (
          <Image
            src={front.src}
            alt={front.alt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="peek-front object-cover"
            priority={priority}
          />
        )}
        {back && back !== front && (
          <Image
            src={back.src}
            alt={back.alt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="peek-back object-cover"
          />
        )}
        {product.compareAtUsd && product.compareAtUsd > product.priceUsd && (
          <div className="absolute top-4 left-4 bg-midnight/85 text-gold text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-sm">
            Sale
          </div>
        )}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-midnight/60 backdrop-blur-md text-gold text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          View piece →
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-2xl leading-tight text-cream group-hover:text-gold transition-colors">
            {cleanTitle}
          </div>
          {product.subtitle && (
            <div className="text-[13px] italic text-cream-deep mt-1">
              {product.subtitle}
            </div>
          )}
        </div>
        <ProductCardPrice
          priceUsd={product.priceUsd}
          priceIdr={product.priceIdr}
        />
      </div>
    </Link>
  );
}
