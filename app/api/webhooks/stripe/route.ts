import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { insertPurchaseFromCheckout } from "@/lib/purchases";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/utils/supabase/admin";

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

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, skipped: "not_paid" });
    }

    const emailRaw =
      session.customer_details?.email ?? session.customer_email ?? null;
    const email = emailRaw?.trim().toLowerCase() ?? null;
    if (!email) {
      console.warn("[stripe webhook] paid session without email", session.id);
      return NextResponse.json({ received: true, skipped: "no_email" });
    }

    try {
      const admin = createAdminClient();
      const packageId =
        typeof session.metadata?.package_id === "string"
          ? session.metadata.package_id.trim() || null
          : null;

      await insertPurchaseFromCheckout(admin, {
        stripe_checkout_session_id: session.id,
        email,
        amount_total: session.amount_total,
        currency: session.currency,
        package_id: packageId,
      });
    } catch (e) {
      console.error("[stripe webhook] purchase insert failed", e);
      return NextResponse.json({ error: "Fulfillment write failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
