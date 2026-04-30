/**
 * Public site URL for Stripe redirects. Set in production (e.g. Vercel):
 *   NEXT_PUBLIC_APP_URL=https://yourdomain.com
 * Falls back to the incoming request origin in development.
 */
export function getAppOrigin(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return new URL(request.url).origin;
}
