import Link from "next/link";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-eggplant-deep">
      <header className="border-b border-violet">
        <div className="container-wide flex items-center justify-between py-4">
          <Link href="/admin/orders" className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.32em] text-gold/70">
              ZenAura · Admin
            </span>
          </Link>
          <Link
            href="/"
            className="text-[12px] uppercase tracking-[0.22em] text-cream-deep hover:text-gold transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
