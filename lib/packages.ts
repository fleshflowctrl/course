/** Sellable access tiers (EUR, one-time). Stripe amounts in cents. */
export const PACKAGES = [
  {
    id: "foundations",
    priceCents: 1295,
    label: "€12.95",
    title: "Module 1: Foundations",
    subtitle: "5 videos",
    description:
      "What perimenopause is, hormones, symptoms list, tracking, and how to work with doctors.",
  },
  {
    id: "foundations_symptoms",
    priceCents: 1695,
    label: "€16.95",
    title: "Modules 1 + 2",
    subtitle: "Foundations + Major Symptoms (15 videos)",
    description:
      "Everything in Foundations plus sleep, mood, brain fog, hot flushes, joints, weight, libido, periods, and more.",
  },
  {
    id: "full",
    priceCents: 1995,
    label: "€19.95",
    title: "Full course",
    subtitle: "All 4 modules (30 videos)",
    description:
      "Complete access: treatment options, practical life, scripts for doctors and partners, and the full curriculum.",
    mostPopular: true,
  },
] as const;

export type PackageId = (typeof PACKAGES)[number]["id"];

export function getPackageById(id: string) {
  return PACKAGES.find((p) => p.id === id);
}

export const LOWEST_PACKAGE_LABEL = PACKAGES[0].label;
