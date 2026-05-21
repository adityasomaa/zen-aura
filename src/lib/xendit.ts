/**
 * Thin Xendit client. We use the REST API directly to avoid bundling the full SDK.
 * Docs: https://developers.xendit.co/api-reference/#create-invoice
 */

const XENDIT_BASE = "https://api.xendit.co";

function authHeader(): string {
  const key = process.env.XENDIT_SECRET_KEY;
  if (!key) {
    throw new Error(
      "XENDIT_SECRET_KEY is not set. Add it to .env.local (see .env.example).",
    );
  }
  return "Basic " + Buffer.from(`${key}:`).toString("base64");
}

export interface XenditInvoice {
  id: string;
  invoice_url: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
  amount: number;
  external_id: string;
}

export interface CreateInvoiceParams {
  externalId: string;
  amount: number; // in IDR (integer)
  description: string;
  customerEmail?: string;
  successUrl?: string;
  failureUrl?: string;
}

export async function createInvoice(p: CreateInvoiceParams): Promise<XenditInvoice> {
  const res = await fetch(`${XENDIT_BASE}/v2/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      external_id: p.externalId,
      amount: p.amount,
      description: p.description,
      payer_email: p.customerEmail,
      success_redirect_url: p.successUrl ?? process.env.XENDIT_SUCCESS_URL,
      failure_redirect_url: p.failureUrl ?? process.env.XENDIT_FAILURE_URL,
      currency: "IDR",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Xendit createInvoice failed: ${res.status} ${text}`);
  }
  return (await res.json()) as XenditInvoice;
}
