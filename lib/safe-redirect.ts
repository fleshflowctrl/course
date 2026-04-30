/** Same-origin path only — prevents open redirects after login. */
export function safeRedirectPath(path: string | undefined, fallback = "/course"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}
