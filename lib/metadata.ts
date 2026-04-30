import type { Metadata } from "next";

const siteName = "Perimenopause Course";
const defaultDescription =
  "30 video lessons on perimenopause and menopause from a medical specialist. Lifetime access. One-time purchase.";

export function createMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL("https://example.com"),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: defaultDescription,
    openGraph: {
      type: "website",
      siteName,
      locale: "en_GB",
    },
    ...overrides,
  };
}
