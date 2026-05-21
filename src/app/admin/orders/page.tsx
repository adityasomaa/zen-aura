import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthed } from "@/lib/admin-auth";
import { getAllOrders, type Order, type OrderStatus } from "@/lib/orders";
import { OrdersFilters } from "./OrdersFilters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS_TINT: Record<OrderStatus, string> = {
  paid: "bg-sage/20 text-sage border-sage/40",
  pending: "bg-gold/15 text-gold border-gold/40",
  failed: "bg-rose/20 text-rose border-rose/40",
  expired: "bg-violet/40 text-cream-deep border-violet",
  refunded: "bg-violet/40 text-cream-deep border-violet",
  unknown: "bg-violet/40 text-cream-deep border-violet",
};

function fmtMoney(o: Order) {
  return new Intl.NumberFormat(o.currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: o.currency,
    maximumFractionDigits: o.currency === "IDR" ? 0 : 2,
  }).format(o.amount);
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; source?: string }>;
}) {
  if (!(await isAuthed())) {
    redirect("/admin/login?next=/admin/orders");
  }

  const params = await searchParams;
  const filterStatus = (params.status ?? "all") as OrderStatus | "all";
  const filterSource = (params.source ?? "all") as "stripe" | "xendit" | "all";

  const { orders, stripeConfigured, xenditConfigured } = await getAllOrders();

  const filtered = orders.filter((o) => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (filterSource !== "all" && o.source !== filterSource) return false;
    return true;
  });

  const counts = {
    all: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    pending: orders.filter((o) => o.status === "pending").length,
    failed: orders.filter((o) => ["failed", "expired"].includes(o.status))
      .length,
  };

  const totalRevenueUsd = orders
    .filter((o) => o.status === "paid" && o.currency === "USD")
    .reduce((sum, o) => sum + o.amount, 0);
  const totalRevenueIdr = orders
    .filter((o) => o.status === "paid" && o.currency === "IDR")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <section className="container-wide py-12">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.32em] text-gold/70 mb-2">
            Live · pulled from Stripe + Xendit
          </div>
          <h1 className="font-display text-cream text-4xl md:text-5xl tracking-tight">
            Orders
          </h1>
        </div>
        <form action="/api/admin/login" method="post" className="hidden" />
        <SignOutButton />
      </div>

      {/* Source status warnings */}
      {(!stripeConfigured || !xenditConfigured) && (
        <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
          {!stripeConfigured && (
            <div className="border border-gold/40 rounded-2xl px-4 py-3 text-cream-deep bg-eggplant">
              <span className="text-gold">⚠ STRIPE_SECRET_KEY</span> not
              configured — USD orders won&rsquo;t load.
            </div>
          )}
          {!xenditConfigured && (
            <div className="border border-gold/40 rounded-2xl px-4 py-3 text-cream-deep bg-eggplant">
              <span className="text-gold">⚠ XENDIT_SECRET_KEY</span> not
              configured — IDR orders won&rsquo;t load.
            </div>
          )}
        </div>
      )}

      {/* Stat tiles */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Total orders" value={String(counts.all)} />
        <StatTile label="Paid" value={String(counts.paid)} accent />
        <StatTile
          label="Revenue · USD"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(totalRevenueUsd)}
        />
        <StatTile
          label="Revenue · IDR"
          value={new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(totalRevenueIdr)}
        />
      </div>

      {/* Filters */}
      <div className="mt-10">
        <OrdersFilters
          status={filterStatus}
          source={filterSource}
          counts={counts}
        />
      </div>

      {/* Orders list */}
      <div className="mt-6 border border-violet rounded-3xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-cream-deep">
            <div className="font-display text-cream text-2xl mb-2">
              No orders {filterStatus !== "all" ? `with status "${filterStatus}"` : "yet"}.
            </div>
            <p className="text-sm">
              Once a checkout completes via{" "}
              <span className="text-gold">Stripe</span> or{" "}
              <span className="text-gold">Xendit</span>, it will appear here in
              real time.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-violet">
            {filtered.map((o) => (
              <li
                key={`${o.source}-${o.id}`}
                className="grid grid-cols-1 md:grid-cols-[160px_120px_1fr_160px_140px] gap-3 md:gap-5 items-center px-5 py-4 hover:bg-violet/20 transition-colors"
              >
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gold/70">
                    {o.source}
                  </div>
                  <div className="text-[12px] text-cream-deep mt-0.5">
                    {fmtDate(o.createdAt)}
                  </div>
                </div>
                <div>
                  <StatusPill status={o.status} />
                </div>
                <div className="min-w-0">
                  <div className="text-cream text-sm truncate">
                    {o.customerEmail ?? "—"}
                  </div>
                  <div className="text-[11px] text-cream-deep/70 truncate font-mono">
                    {o.externalId ?? o.id}
                  </div>
                </div>
                <div className="text-right md:text-right text-cream tabular-nums">
                  {fmtMoney(o)}
                </div>
                <div className="text-right">
                  {o.url ? (
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] uppercase tracking-[0.18em] text-cream-deep hover:text-gold transition-colors"
                    >
                      Receipt →
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-8 text-xs text-cream-deep/60 italic max-w-2xl">
        Data is fetched live each load (no cache) from the Stripe Checkout
        Sessions API + Xendit Invoices API. To accept real orders, set
        STRIPE_SECRET_KEY and XENDIT_SECRET_KEY in Vercel and configure their
        webhook URLs (already wired at <Link href="/" className="underline decoration-gold/40 underline-offset-2 hover:text-gold">/api/webhooks/stripe</Link> and
        /api/webhooks/xendit).
      </p>
    </section>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-violet rounded-2xl px-5 py-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-cream-deep/70">
        {label}
      </div>
      <div
        className={`mt-2 font-display text-2xl md:text-3xl tabular-nums ${
          accent ? "text-gold" : "text-cream"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] border rounded-full px-2.5 py-1 ${STATUS_TINT[status]}`}
    >
      <span className="block w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function SignOutButton() {
  return (
    <form action="/admin/logout" method="get">
      <button
        type="submit"
        className="text-[12px] uppercase tracking-[0.22em] text-cream-deep hover:text-gold transition-colors"
      >
        Sign out
      </button>
    </form>
  );
}
