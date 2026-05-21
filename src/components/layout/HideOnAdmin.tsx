"use client";

import { usePathname } from "next/navigation";

/**
 * Hides its children on any /admin/* route so the admin experience
 * is a clean canvas — no site header, footer, welcome popup, cookies
 * banner, or marquee bleed-through.
 */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
