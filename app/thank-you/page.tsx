import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FIRST_LESSON_LABEL } from "@/content/course-data";
import {
  COURSE_PLATFORM_URL,
  coursePlatformOpensExternally,
  coursePlatformOrHubHref,
} from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Welcome — your access is on the way",
  description:
    "Thank you for your purchase. Open your email for login details, then start the course on the learning platform.",
  robots: { index: false, follow: false },
});

export default function ThankYouPage() {
  return (
    <div className="bg-cream py-section-y lg:py-section-y-lg">
      <Container>
        <Card className="mx-auto max-w-2xl p-8 sm:p-10">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-taupe sm:text-4xl">
            Welcome — your access is on the way
          </h1>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-taupe">
            <li>
              Check your email for login details from your course platform. Use the same
              address you paid with unless you were told otherwise.
            </li>
            <li>
              If nothing arrives within about five minutes, check spam or promotions, then
              contact us at{" "}
              <a
                href="mailto:hello@example.com"
                className="font-medium text-terracotta underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                hello@example.com
              </a>
              .
            </li>
            <li>
              <strong className="font-semibold text-taupe">Start here:</strong> open the
              platform and begin with{" "}
              <span className="text-brown">{FIRST_LESSON_LABEL}</span>.
            </li>
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {coursePlatformOpensExternally() ? (
              <Button
                href={COURSE_PLATFORM_URL}
                external
                size="lg"
                className="w-full justify-center sm:w-auto"
                aria-label="Open the course platform to log in and watch lessons"
              >
                Open course platform
              </Button>
            ) : (
              <Button
                href={coursePlatformOrHubHref()}
                size="lg"
                className="w-full justify-center sm:w-auto"
                aria-label="Open course access and curriculum on this site"
              >
                Course access &amp; curriculum
              </Button>
            )}
            {coursePlatformOpensExternally() ? (
              <Button
                href="/course"
                variant="secondary"
                size="lg"
                className="w-full justify-center sm:w-auto"
              >
                Curriculum on this site
              </Button>
            ) : (
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                className="w-full justify-center sm:w-auto"
              >
                Need help?
              </Button>
            )}
          </div>

          <p className="mt-8 text-sm text-brown">
            Video playback and your account live on the learning platform, not on this
            site.
          </p>

          <p className="mt-6 text-center text-sm">
            <Link
              href="/"
              className="font-medium text-terracotta underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Back to home
            </Link>
          </p>
        </Card>
      </Container>
    </div>
  );
}
