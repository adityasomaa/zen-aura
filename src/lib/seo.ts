import type { Metadata } from "next";

const SITE_NAME = "ZenAura Bali";
const SITE_DESCRIPTION =
  "Bohemian fashion, silver jewelry, and spiritual treasures handcrafted in Ubud, Bali.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zen-aura.vercel.app";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Handcrafted in Ubud`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};
