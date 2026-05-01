import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PurchaseSignupForm } from "@/components/auth/PurchaseSignupForm";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/metadata";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = createMetadata({
  title: "Create your account",
  description: "Finish signup after purchase to access your lessons.",
  robots: { index: false, follow: false },
});

type SignupPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { session_id } = await searchParams;
  const sid = session_id?.trim();

  if (!sid) {
    redirect("/thank-you");
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return (
      <div className="bg-cream py-section-y lg:py-section-y-lg">
        <Container>
          <Card className="mx-auto max-w-md p-8">
            <p className="text-taupe">Stripe is not configured on this deployment.</p>
            <p className="mt-4 text-center text-sm">
              <Link href="/" className="text-terracotta underline">
                Home
              </Link>
            </p>
          </Card>
        </Container>
      </div>
    );
  }

  let email: string | null = null;
  let paid = false;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sid);
    paid = session.payment_status === "paid";
    const raw = session.customer_details?.email ?? session.customer_email;
    email = raw?.trim().toLowerCase() ?? null;
  } catch {
    redirect("/thank-you");
  }

  if (!paid || !email) {
    redirect("/thank-you");
  }

  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

  return (
    <div className="bg-cream py-section-y lg:py-section-y-lg">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-taupe sm:text-4xl">
            Create your account
          </h1>
          <p className="mt-3 text-base leading-relaxed text-brown">
            Your payment is confirmed. Choose a password once — then you&apos;ll go straight
            to your lesson list (each checkout link can only be used once to create an
            account).
          </p>

          {!hasServiceRole ? (
            <Card className="mt-8 border border-divider bg-beige/40 p-6">
              <p className="text-sm leading-relaxed text-taupe">
                <strong className="font-semibold">Server signup is not wired yet.</strong> Add{" "}
                <code className="rounded bg-card px-1 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
                from Supabase → Project Settings → API (service_role secret) to your{" "}
                <code className="rounded bg-card px-1 py-0.5 text-xs">.env.local</code> or
                Vercel env, then redeploy / restart.
              </p>
            </Card>
          ) : (
            <Card className="mt-8 p-6 sm:p-8">
              <PurchaseSignupForm sessionId={sid} email={email} />
            </Card>
          )}

          <p className="mt-8 text-center text-sm text-brown">
            <Link
              href="/"
              className="font-medium text-terracotta underline-offset-2 hover:underline"
            >
              Back to home
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
