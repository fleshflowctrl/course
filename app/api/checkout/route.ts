import { NextResponse } from "next/server";
import { getAppOrigin } from "@/lib/app-origin";
import {
  COURSE_CURRENCY,
  COURSE_PRODUCT_DESCRIPTION,
  COURSE_PRODUCT_NAME,
  COURSE_UNIT_AMOUNT_CENTS,
} from "@/lib/payments";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const origin = getAppOrigin(request);
    const stripe = getStripe();

    const priceId = process.env.STRIPE_PRICE_ID?.trim();
    const lineItems = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: COURSE_CURRENCY,
              unit_amount: COURSE_UNIT_AMOUNT_CENTS,
              product_data: {
                name: COURSE_PRODUCT_NAME,
                description: COURSE_PRODUCT_DESCRIPTION,
              },
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: "always",
      metadata: {
        product: "perimenopause_course",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout]", e);
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
