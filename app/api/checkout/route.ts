import { NextResponse } from "next/server";
import { getAppOrigin } from "@/lib/app-origin";
import { COURSE_BRAND, COURSE_CURRENCY } from "@/lib/payments";
import { getPackageById } from "@/lib/packages";
import { getStripe } from "@/lib/stripe";

type Body = { package_id?: string };

export async function POST(request: Request) {
  try {
    let body: Body = {};
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        body = (await request.json()) as Body;
      } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
      }
    }

    const packageId = body.package_id?.trim();
    if (!packageId) {
      return NextResponse.json(
        { error: "Missing package_id — choose a package first." },
        { status: 400 },
      );
    }

    const pkg = getPackageById(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Unknown package" }, { status: 400 });
    }

    const origin = getAppOrigin(request);
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: COURSE_CURRENCY,
            unit_amount: pkg.priceCents,
            product_data: {
              name: `${COURSE_BRAND} — ${pkg.title}`,
              description: pkg.subtitle,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: "always",
      metadata: {
        product: "perimenopause_course",
        package_id: pkg.id,
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
