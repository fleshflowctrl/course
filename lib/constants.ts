/** Replace with Coachy / Plug&Pay / Teachable checkout URL. */
export const CHECKOUT_URL = "https://checkout.example.com";

/**
 * Where paying customers log in and watch lessons (Coachy, Teachable, etc.).
 * Set in `.env.local` or Vercel:
 *   NEXT_PUBLIC_COURSE_PLATFORM_URL=https://your-school.teachable.com/...
 *
 * `/course` is member-only (Supabase session). This URL opens the external player/library.
 */
export const COURSE_PLATFORM_URL =
  process.env.NEXT_PUBLIC_COURSE_PLATFORM_URL?.trim() ?? "";

/** True when an http(s) LMS URL is configured (open in new tab). */
export function coursePlatformOpensExternally(): boolean {
  return /^https?:\/\//i.test(COURSE_PLATFORM_URL);
}

/** Use for href: real LMS, or `/course` when the library URL is not set yet. */
export function coursePlatformOrHubHref(): string {
  return coursePlatformOpensExternally() ? COURSE_PLATFORM_URL : "/course";
}
