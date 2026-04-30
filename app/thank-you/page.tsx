import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FIRST_LESSON_LABEL } from "@/content/course-data";
import { COURSE_PLATFORM_URL, coursePlatformOpensExternally } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = createMetadata({
  title: "Welcome — your access is on the way",
  description:
    "Thank you for your purchase. Create your account, then open your lessons.",
  robots: { index: false, follow: false },
});

type ThankYouPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { session_id } = await searchParams;
  const sid = session_id?.trim() ?? "";

  let paymentConfirmed = false;
  let payerEmail: string | null = null;

  if (sid && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sid);
      if (session.payment_status === "paid") {
        paymentConfirmed = true;
        payerEmail =
          session.customer_details?.email ?? session.customer_email ?? null;
      }
    } catch {
      // Invalid session — show generic content below.
    }
  }

  const signupHref = sid
    ? `/signup?session_id=${encodeURIComponent(sid)}`
    : "/signup";

  return (
    <div className="bg-cream py-section-y lg:py-section-y-lg">
      <Container>
        <Card className="mx-auto max-w-2xl p-8 sm:p-10">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-taupe sm:text-4xl">
            Thank you — you&apos;re almost in
          </h1>

          {paymentConfirmed ? (
            <>
              <p className="mt-6 rounded-button border border-success/30 bg-success/10 px-4 py-3 text-base text-taupe">
                <strong className="font-semibold text-taupe">Payment received.</strong>
                {payerEmail ? (
                  <>
                    {" "}
                    Receipt will go to <span className="text-brown">{payerEmail}</span>.
                  </>
                ) : null}
              </p>

              <p className="mt-6 text-base leading-relaxed text-taupe">
                <strong className="font-semibold text-taupe">Next step:</strong> create a
                password for this site. You&apos;ll land on your lesson list right after.
              </p>

              <div className="mt-8">
                <Button
                  href={signupHref}
                  size="lg"
                  className="w-full justify-center"
                  aria-label="Create your account after purchase"
                >
                  Create your account &amp; open lessons
                </Button>
              </div>

              <p className="mt-4 text-sm text-brown">
                Same email as checkout: you&apos;ll only set a password — no duplicate
                charge.
              </p>
            </>
          ) : (
            <p className="mt-6 text-base leading-relaxed text-brown">
              If you just paid, return from Stripe with the success link, or contact us if
              something looks wrong.
            </p>
          )}

          <div className="mt-10 border-t border-divider pt-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brown">
              After you&apos;re signed in
            </p>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-taupe">
              <li>
                Your <strong className="font-semibold">videos</strong> open from the lesson
                list on <strong className="font-semibold">Course login</strong> (or your
                external host if linked).
              </li>
              <li>
                Start with{" "}
                <span className="text-brown">{FIRST_LESSON_LABEL}</span> when you&apos;re
                ready.
              </li>
              <li>
                Questions?{" "}
                <a
                  href="mailto:hello@example.com"
                  className="font-medium text-terracotta underline-offset-2 hover:underline"
                >
                  hello@example.com
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {coursePlatformOpensExternally() ? (
              <Button
                href={COURSE_PLATFORM_URL}
                external
                size="lg"
                variant="secondary"
                className="w-full justify-center sm:w-auto"
                aria-label="Open the course platform"
              >
                Open video host
              </Button>
            ) : null}
            <Button
              href="/course"
              variant="secondary"
              size="lg"
              className="w-full justify-center sm:w-auto"
            >
              Lesson list (after log in)
            </Button>
            <Button href="/contact" variant="ghost" size="lg" className="w-full sm:w-auto">
              Need help?
            </Button>
          </div>

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
