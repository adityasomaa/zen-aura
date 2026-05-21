/**
 * Unified order list — pulls from Stripe Checkout Sessions and
 * Xendit Invoices, normalises the two into a single shape.
 *
 * Used by /admin/orders. Server-side only.
 */

export type OrderStatus =
  | "paid"
  | "pending"
  | "failed"
  | "expired"
  | "refunded"
  | "unknown";

export type OrderSource = "stripe" | "xendit";

export interface Order {
  id: string;
  source: OrderSource;
  externalId?: string;
  status: OrderStatus;
  rawStatus: string;
  amount: number; // major units (USD dollars or IDR rupiah)
  currency: "USD" | "IDR";
  customerEmail?: string;
  customerName?: string;
  createdAt: string; // ISO
  url?: string;
}

function mapStripeStatus(
  session: { status?: string | null; payment_status?: string | null },
): OrderStatus {
  if (session.payment_status === "paid") return "paid";
  if (session.status === "expired") return "expired";
  if (session.payment_status === "unpaid") return "pending";
  if (session.status === "complete") return "paid";
  if (session.status === "open") return "pending";
  return "unknown";
}

function mapXenditStatus(s: string): OrderStatus {
  switch (s.toUpperCase()) {
    case "PAID":
    case "SETTLED":
      return "paid";
    case "PENDING":
      return "pending";
    case "EXPIRED":
      return "expired";
    case "FAILED":
      return "failed";
    default:
      return "unknown";
  }
}

async function fetchStripeOrders(): Promise<Order[]> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      "https://api.stripe.com/v1/checkout/sessions?limit=100",
      { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) {
      console.warn("[orders] stripe fetch failed", res.status);
      return [];
    }
    const json = (await res.json()) as {
      data: Array<{
        id: string;
        status: string | null;
        payment_status: string | null;
        amount_total: number | null;
        currency: string | null;
        customer_details?: { email?: string | null; name?: string | null } | null;
        created: number;
        url?: string | null;
      }>;
    };
    return json.data.map((s) => ({
      id: s.id,
      source: "stripe" as const,
      status: mapStripeStatus(s),
      rawStatus: `${s.status ?? "?"}/${s.payment_status ?? "?"}`,
      amount: (s.amount_total ?? 0) / 100,
      currency: ((s.currency ?? "usd").toUpperCase() === "IDR"
        ? "IDR"
        : "USD") as Order["currency"],
      customerEmail: s.customer_details?.email ?? undefined,
      customerName: s.customer_details?.name ?? undefined,
      createdAt: new Date(s.created * 1000).toISOString(),
      url: s.url ?? undefined,
    }));
  } catch (e) {
    console.warn("[orders] stripe fetch error", e);
    return [];
  }
}

async function fetchXenditOrders(): Promise<Order[]> {
  const key = process.env.XENDIT_SECRET_KEY;
  if (!key) return [];
  try {
    const auth = Buffer.from(`${key}:`).toString("base64");
    const res = await fetch("https://api.xendit.co/v2/invoices?limit=100", {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn("[orders] xendit fetch failed", res.status);
      return [];
    }
    const json = (await res.json()) as Array<{
      id: string;
      external_id: string;
      status: string;
      amount: number;
      currency: string;
      payer_email?: string;
      created: string;
      invoice_url?: string;
    }>;
    return json.map((inv) => ({
      id: inv.id,
      source: "xendit" as const,
      externalId: inv.external_id,
      status: mapXenditStatus(inv.status),
      rawStatus: inv.status,
      amount: inv.amount,
      currency: (inv.currency?.toUpperCase() ?? "IDR") as Order["currency"],
      customerEmail: inv.payer_email,
      createdAt: inv.created,
      url: inv.invoice_url,
    }));
  } catch (e) {
    console.warn("[orders] xendit fetch error", e);
    return [];
  }
}

export async function getAllOrders(): Promise<{
  orders: Order[];
  stripeConfigured: boolean;
  xenditConfigured: boolean;
}> {
  const [stripe, xendit] = await Promise.all([
    fetchStripeOrders(),
    fetchXenditOrders(),
  ]);
  const orders = [...stripe, ...xendit].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
  return {
    orders,
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    xenditConfigured: !!process.env.XENDIT_SECRET_KEY,
  };
}
