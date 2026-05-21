import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCardPrice } from "./ProductCardPrice";

interface Props {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: Props) {
  const cover = product.images[0];
  const cleanTitle = product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      aria-label={cleanTitle}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-violet bg-violet">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet to-midnight" />
        )}
        {product.compareAtUsd && product.compareAtUsd > product.priceUsd && (
          <div className="absolute top-3 left-3 bg-midnight/85 text-gold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
            Sale
          </div>
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(180deg, transparent 55%, rgba(26,11,30,0.6))",
          }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-xl leading-tight text-cream group-hover:text-gold transition-colors">
            {cleanTitle}
          </div>
          {product.subtitle && (
            <div className="text-sm italic text-cream-deep mt-0.5">
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
