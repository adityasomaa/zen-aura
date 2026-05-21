export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin canvas — no shared chrome. Each admin page renders its own
 * top bar (or none, for login).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight text-cream">
      {children}
    </div>
  );
}
