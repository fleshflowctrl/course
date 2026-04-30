import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { User } from "@supabase/supabase-js";
import { COURSE_MODULES } from "@/content/course-data";
import { COURSE_PLATFORM_URL, coursePlatformOpensExternally } from "@/lib/constants";

type Props = {
  user: User;
};

export function CourseMemberDashboard({ user }: Props) {
  const displayEmail = user.email ?? "your account";

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-wide text-brown">
        You&apos;re in
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-taupe sm:text-4xl lg:text-[40px]">
        Your videos — 30 lessons
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-taupe">
        Welcome back,{" "}
        <span className="font-medium text-brown">{displayEmail}</span>. Start below
        {coursePlatformOpensExternally() ? (
          <>
            , or{" "}
            <a
              href={COURSE_PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-terracotta underline decoration-terracotta/40 underline-offset-2 hover:decoration-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              open your full library
            </a>
            .
          </>
        ) : (
          "."
        )}
      </p>

      <ul className="mt-8 space-y-8">
        {COURSE_MODULES.map((mod) => (
          <li key={mod.id}>
            <Card className="overflow-hidden p-0">
              <div className="border-b border-divider bg-beige/30 px-5 py-4 sm:px-6">
                <h2 className="font-heading text-lg font-semibold text-taupe sm:text-xl">
                  {mod.title}
                  <span className="ml-1.5 font-sans text-base font-normal text-brown">
                    ({mod.videoCount} videos)
                  </span>
                </h2>
              </div>
              <ul className="divide-y divide-divider">
                {mod.videos.map((title) => (
                  <li
                    key={title}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <span className="text-base leading-snug text-taupe">{title}</span>
                    {coursePlatformOpensExternally() ? (
                      <Button
                        href={COURSE_PLATFORM_URL}
                        external
                        size="md"
                        className="shrink-0 justify-center"
                        aria-label={`Watch: ${title}`}
                      >
                        Watch
                      </Button>
                    ) : (
                      <span className="text-sm text-brown">Library not linked</span>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
        <Link
          href="/"
          className="text-sm font-medium text-terracotta underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          Back to home
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}
