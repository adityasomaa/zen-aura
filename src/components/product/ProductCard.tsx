import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCardPrice } from "./ProductCardPrice";

interface Props {
  product: Product;
  priority?: boolean;
  /** Aspect ratio class — defaults to portrait. */
  aspect?: string;
  /** Visual size — controls title scale. */
  size?: "sm" | "md" | "lg";
}

const TITLE_SIZE = {
  sm: "text-[15px]",
  md: "text-base md:text-[17px]",
  lg: "text-xl md:text-2xl",
};

export function ProductCard({
  product,
  priority,
  aspect = "aspect-[4/5]",
  size = "md",
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
        className={`peek-card relative ${aspect} overflow-hidden rounded-2xl ring-1 ring-violet/60 bg-violet`}
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
          <div className="absolute top-3 left-3 bg-midnight/85 text-gold text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full backdrop-blur-sm">
            Sale
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div
            className={`font-display ${TITLE_SIZE[size]} leading-snug text-cream group-hover:text-gold transition-colors line-clamp-2`}
          >
            {cleanTitle}
          </div>
          {product.subtitle && size !== "sm" && (
            <div className="text-[12px] italic text-cream-deep mt-0.5 truncate">
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
