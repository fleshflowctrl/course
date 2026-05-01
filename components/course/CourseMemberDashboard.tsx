import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { WatchLessonButton } from "@/components/course/WatchLessonButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { User } from "@supabase/supabase-js";
import { COURSE_MODULES } from "@/content/course-data";
import { COURSE_LESSON_COUNT } from "@/lib/course-lessons";
import { courseVideoStorageConfigured } from "@/lib/course-storage";
import { COURSE_PLATFORM_URL, coursePlatformOpensExternally } from "@/lib/constants";

type Props = {
  user: User;
};

export function CourseMemberDashboard({ user }: Props) {
  const displayEmail = user.email ?? "your account";
  const storageConfigured = courseVideoStorageConfigured();
  const external = coursePlatformOpensExternally();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-wide text-brown">
        You&apos;re in
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-taupe sm:text-4xl lg:text-[40px]">
        Your videos — {COURSE_LESSON_COUNT} lessons
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-taupe">
        Welcome back,{" "}
        <span className="font-medium text-brown">{displayEmail}</span>. Start below
        {storageConfigured ? (
          <>
            . Lessons are numbered 1–{COURSE_LESSON_COUNT} in the same order as on this page
            (Module 1 first, then 2, 3, 4).
          </>
        ) : null}
        {!storageConfigured && external ? (
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
        ) : null}
        {!storageConfigured && !external ? "." : null}
      </p>

      <ul className="mt-8 space-y-8">
        {COURSE_MODULES.map((mod, modIndex) => {
          const moduleLessonStart = COURSE_MODULES.slice(0, modIndex).reduce(
            (sum, m) => sum + m.videos.length,
            0,
          );

          return (
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
                  {mod.videos.map((title, videoIdx) => {
                    const lessonNumber = moduleLessonStart + videoIdx + 1;
                    return (
                      <li
                        key={`${mod.id}-${lessonNumber}`}
                        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-brown">
                            Lesson {lessonNumber}
                          </span>
                          <span className="mt-1 block text-base leading-snug text-taupe">
                            {title}
                          </span>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                          <WatchLessonButton
                            lessonNumber={lessonNumber}
                            title={title}
                            storageConfigured={storageConfigured}
                          />
                          {external ? (
                            <Button
                              href={COURSE_PLATFORM_URL}
                              external
                              variant="secondary"
                              size="md"
                              className="w-full justify-center sm:w-auto"
                              aria-label={`Open external library for: ${title}`}
                            >
                              External library
                            </Button>
                          ) : null}
                          {!storageConfigured && !external ? (
                            <span className="text-sm text-brown">
                              Library not linked — add{" "}
                              <code className="rounded bg-beige/80 px-1 text-xs">
                                NEXT_PUBLIC_COURSE_VIDEO_BUCKET
                              </code>{" "}
                              or an LMS URL.
                            </span>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </li>
          );
        })}
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
