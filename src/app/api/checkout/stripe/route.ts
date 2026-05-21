import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { assertStripe } from "@/lib/stripe";
import { getProductByHandle } from "@/lib/products";
import type { CartLine } from "@/lib/types";

type StripeCreateParams = NonNullable<
  Parameters<Stripe["checkout"]["sessions"]["create"]>[0]
>;
type StripeLineItem = NonNullable<StripeCreateParams["line_items"]>[number];

interface Body {
  lines: CartLine[];
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

  let stripe;
  try {
    stripe = assertStripe();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stripe not configured" },
      { status: 500 },
    );
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${req.headers.get("host") ?? "zen-aura.vercel.app"}`;

  const line_items: StripeLineItem[] = [];
  for (const line of body.lines) {
    const product = getProductByHandle(line.productHandle);
    if (!product) continue;
    const variant = product.variants.find((v) => v.id === line.variantId);
    const unitUsd =
      variant?.priceUsdOverride != null
        ? variant.priceUsdOverride
        : product.priceUsd;
    const cleanTitle = product.title.replace(/[🪬🌴🔮✨💫]/g, "").trim();
    line_items.push({
      quantity: line.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(unitUsd * 100),
        product_data: {
          name: cleanTitle,
          description:
            variant && variant.id !== "default" ? variant.label : undefined,
          images: product.images[0] ? [product.images[0].src] : undefined,
          metadata: {
            handle: product.handle,
            variantId: line.variantId,
          },
        },
      },
    });
  }

  if (line_items.length === 0) {
    return NextResponse.json(
      { error: "No valid products in cart" },
      { status: 400 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: {
        allowed_countries: [
          "US", "GB", "AU", "CA", "DE", "FR", "ID", "SG", "MY", "TH", "JP",
          "NL", "BE", "IT", "ES", "SE", "DK", "NO", "FI", "CH", "AT", "IE",
          "NZ", "AE", "HK", "TW", "PH", "VN",
        ],
      },
      phone_number_collection: { enabled: true },
      success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/cart`,
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to create Stripe session",
      },
      { status: 500 },
    );
  }
}
