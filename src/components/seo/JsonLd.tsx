import type { Product } from "@/lib/types";
import { SITE } from "@/lib/seo";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo.jpg`,
    description: SITE.description,
    foundingDate: "2023",
    foundingLocation: {
      "@type": "Place",
      name: "Ubud, Bali, Indonesia",
    },
    sameAs: ["https://instagram.com/zenaura_bali"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+62-877-0359-2240",
        email: "hello@zenaura-bali.com",
        availableLanguage: ["en", "id"],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const cleanTitle = product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();
  const inStock = product.variants.some((v) => v.inStock);
  const images = product.images.map((img) =>
    img.src.startsWith("http") ? img.src : `${SITE.url}${img.src}`,
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cleanTitle,
    description:
      product.description?.slice(0, 5000) ??
      `${cleanTitle} — handcrafted in Ubud by ZenAura Bali.`,
    image: images.length > 0 ? images : undefined,
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    category: product.category,
    sku: product.handle,
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/products/${product.handle}`,
      priceCurrency: "USD",
      price: product.priceUsd.toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE.url}${it.url}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
