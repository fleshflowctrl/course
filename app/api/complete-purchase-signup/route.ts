import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/utils/supabase/admin";

const bodySchema = z.object({
  session_id: z.string().min(10),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join(" ");
      return NextResponse.json({ error: msg || "Invalid request" }, { status: 400 });
    }

    const { session_id, password } = parsed.data;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id.trim());

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed for this session" }, { status: 403 });
    }

    const emailRaw =
      session.customer_details?.email ?? session.customer_email ?? null;
    const email = emailRaw?.trim().toLowerCase() ?? null;
    if (!email) {
      return NextResponse.json(
        { error: "No email on this checkout session — contact support" },
        { status: 422 },
      );
    }

    let admin;
    try {
      admin = createAdminClient();
    } catch {
      return NextResponse.json(
        {
          error:
            "Server signup is not configured. Add SUPABASE_SERVICE_ROLE_KEY in your environment (Supabase → Settings → API → service_role).",
        },
        { status: 503 },
      );
    }

    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        stripe_checkout_session_id: session.id,
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("already") ||
        msg.includes("registered") ||
        msg.includes("exists")
      ) {
        return NextResponse.json(
          {
            error: "An account with this email already exists. Log in with that email instead.",
            code: "user_exists",
          },
          { status: 409 },
        );
      }
      console.error("[complete-purchase-signup]", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, email });
  } catch (e) {
    console.error("[complete-purchase-signup]", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
