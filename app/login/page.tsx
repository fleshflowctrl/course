import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { createMetadata } from "@/lib/metadata";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = createMetadata({
  title: "Log in",
  description: "Sign in to access your course account.",
  robots: { index: false, follow: true },
});

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo: redirectToRaw } = await searchParams;
  const redirectTo = safeRedirectPath(redirectToRaw, "/course");

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(redirectTo);
  }

  return (
    <div className="bg-cream py-section-y lg:py-section-y-lg">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-taupe sm:text-4xl">
            Log in
          </h1>
          <p className="mt-3 text-base leading-relaxed text-brown">
            Members only — use the email and password for your paid course account.
          </p>

          <Card className="mt-8 p-6 sm:p-8">
            <LoginForm redirectTo={redirectTo} />
          </Card>

          <p className="mt-8 text-center text-sm text-brown">
            <Link
              href="/"
              className="font-medium text-terracotta underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Back to home
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
