import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/xendit";
import { getProductByHandle } from "@/lib/products";
import type { CartLine } from "@/lib/types";

interface Body {
  lines: CartLine[];
  email?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.lines?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  let totalIdr = 0;
  const lineDescriptions: string[] = [];

  for (const line of body.lines) {
    const product = getProductByHandle(line.productHandle);
    if (!product) continue;
    const cleanTitle = product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();
    totalIdr += product.priceIdr * line.quantity;
    lineDescriptions.push(`${cleanTitle} × ${line.quantity}`);
  }

  if (totalIdr === 0) {
    return NextResponse.json(
      { error: "No valid products in cart" },
      { status: 400 },
    );
  }

  const externalId = `zenaura-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const description = `ZenAura Bali — ${lineDescriptions.slice(0, 3).join(", ")}${
    lineDescriptions.length > 3 ? ` +${lineDescriptions.length - 3} more` : ""
  }`;

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${req.headers.get("host") ?? "zen-aura.vercel.app"}`;

  try {
    const invoice = await createInvoice({
      externalId,
      amount: totalIdr,
      description,
      customerEmail: body.email,
      successUrl: `${site}/checkout/success?invoice=${externalId}`,
      failureUrl: `${site}/checkout/failed`,
    });
    return NextResponse.json({
      url: invoice.invoice_url,
      invoiceId: invoice.id,
      externalId,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to create Xendit invoice",
      },
      { status: 500 },
    );
  }
}
