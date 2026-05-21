import type { Metadata } from "next";

const SITE_NAME = "ZenAura Bali";
const SITE_DESCRIPTION =
  "Bohemian fashion, silver jewelry, and spiritual treasures handcrafted in Ubud, Bali. Cosmic creations for divine beings — supporting talented family-run craftswomen & craftsmen throughout Bali & Java.";
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zen-aura.vercel.app"
).replace(/\/$/, "");

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Cosmic creations for divine beings`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Shopping",
  keywords: [
    "Bali boutique",
    "Ubud boutique",
    "bohemian fashion",
    "silver jewelry",
    "halter dress",
    "natural fibre viscose",
    "handmade in Bali",
    "spiritual jewelry",
    "festival fashion",
    "alternative attire",
    "ZenAura Bali",
  ],
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Cosmic creations for divine beings`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Cosmic creations for divine beings`,
    description: SITE_DESCRIPTION,
    creator: "@zenaura_bali",
    site: "@zenaura_bali",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "theme-color": "#301934",
  },
};

export const SITE = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
};
