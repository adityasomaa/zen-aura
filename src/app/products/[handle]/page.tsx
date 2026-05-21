import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  getAllProducts,
  getProductByHandle,
  getProductsByCategory,
} from "@/lib/products";
import { formatPrice } from "@/lib/currency";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const p = getProductByHandle(handle);
  if (!p) return {};
  return {
    title: p.title.replace(/[🪬🌴🔮✨💫]/g, "").trim(),
    description:
      p.description?.slice(0, 160) ??
      `${p.title} — handcrafted in Ubud by ZenAura Bali.`,
    openGraph: {
      images: p.images[0] ? [p.images[0].src] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProductByHandle(handle);
  if (!product) notFound();

  const related = getProductsByCategory(product.category)
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  const cleanTitle = product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();
  const paragraphs = product.description
    ? product.description.split(/\n{2,}/).filter(Boolean)
    : [];

  return (
    <>
      <section className="container-wide py-12 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery images={product.images} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="text-xs uppercase tracking-[0.25em] text-ink-muted mb-3">
            <Link
              href={`/shop/${product.category}`}
              className="hover:text-ink transition-colors"
            >
              {product.category}
            </Link>
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight">
            {cleanTitle}
          </h1>
          {product.subtitle && (
            <div className="mt-2 text-ink-soft">{product.subtitle}</div>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <div className="text-2xl tabular-nums">
              {formatPrice(product.priceUsd, "USD")}
            </div>
            <div className="text-sm text-ink-muted tabular-nums">
              {formatPrice(product.priceIdr, "IDR")}
            </div>
            {product.compareAtUsd && product.compareAtUsd > product.priceUsd && (
              <div className="text-sm text-ink-muted line-through">
                {formatPrice(product.compareAtUsd, "USD")}
              </div>
            )}
          </div>

          {product.variants.length > 1 && (
            <div className="mt-8">
              <div className="text-xs uppercase tracking-widest text-ink-muted mb-3">
                Variant
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    disabled={!v.inStock}
                    className="border border-line hover:border-ink px-4 py-2 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="mt-10 w-full bg-ink text-paper py-4 text-sm uppercase tracking-widest hover:bg-terracotta transition-colors">
            Add to cart
          </button>

          {paragraphs.length > 0 && (
            <div className="mt-10 space-y-4 text-ink-soft leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          )}

          <div className="mt-10 rule pt-6 text-xs text-ink-muted space-y-1">
            <div>Handcrafted in Ubud, Bali.</div>
            <div>Worldwide shipping via DHL · 7–21 business days.</div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-wide py-16">
          <div className="rule pt-10 mb-10">
            <div className="font-display text-3xl">You may also like</div>
          </div>
          <ProductGrid products={related} priorityCount={0} />
        </section>
      )}
    </>
  );
}
