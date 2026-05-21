"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  images: ProductImage[];
}

export function ProductGallery({ images }: Props) {
  const [active, setActive] = useState(0);
  if (!images.length) {
    return (
      <div className="aspect-[3/4] rounded-3xl bg-violet ring-1 ring-gold/20" />
    );
  }
  const main = images[active];
  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <div className="flex flex-col gap-3">
        {images.slice(0, 6).map((img, i) => (
          <button
            key={img.src}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-[3/4] rounded-2xl overflow-hidden ring-1 transition-all",
              i === active
                ? "ring-2 ring-gold"
                : "ring-violet hover:ring-gold/50",
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-violet bg-violet">
        <Image
          src={main.src}
          alt={main.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
