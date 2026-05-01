import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/metadata";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = createMetadata({
  title: "Thank you",
  description: "Thanks for visiting. If you completed a purchase, finish signup from your Stripe success link.",
  robots: { index: false, follow: false },
});

type ThankYouPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { session_id } = await searchParams;
  const sid = session_id?.trim() ?? "";

  if (sid && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sid);
      if (session.payment_status === "paid") {
        redirect(`/signup?session_id=${encodeURIComponent(sid)}`);
      }
    } catch {
      // fall through to generic page
    }
  }

  return (
    <div className="bg-cream py-section-y lg:py-section-y-lg">
      <Container>
        <Card className="mx-auto max-w-lg p-8 sm:p-10">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-taupe sm:text-4xl">
            Thank you
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brown">
            If you just paid, you should have been sent straight to{" "}
            <strong className="font-medium text-taupe">create your account</strong>. Open the
            success link from your payment page again, or start from the homepage and use
            checkout once more if the session expired.
          </p>
          <p className="mt-4 text-base leading-relaxed text-brown">
            Need help?{" "}
            <a
              href="mailto:hello@example.com"
              className="font-medium text-terracotta underline-offset-2 hover:underline"
            >
              hello@example.com
            </a>
          </p>
          <p className="mt-8 text-center text-sm">
            <Link
              href="/"
              className="font-medium text-terracotta underline-offset-2 hover:underline"
            >
              Back to home
            </Link>
          </p>
        </Card>
      </Container>
    </div>
  );
}
