import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[stripe webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  }

  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (e) {
    console.error("[stripe webhook] Signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_details?.email ?? session.customer_email ?? undefined;
    const amount = session.amount_total;

    // Fulfillment hook: invite to Supabase / send email / unlock LMS — wire here.
    console.info("[stripe webhook] checkout.session.completed", {
      sessionId: session.id,
      email,
      amount,
      currency: session.currency,
      paymentStatus: session.payment_status,
    });
  }

  return NextResponse.json({ received: true });
}
