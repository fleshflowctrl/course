import Image from "next/image";
import { COURSE_MODULES } from "@/content/course-data";
import { Card } from "@/components/ui/Card";
import { CheckoutLink } from "@/components/ui/CheckoutLink";
import { Container } from "@/components/ui/Container";

/**
 * Hero image: replace with licensed photography.
 * Prompt suggestion: Woman in her late 40s–50s, soft window light, contemplative expression,
 * calm interior, warm cream and taupe tones, documentary portrait — not a bright stock smile.
 */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-cream pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12"
      aria-labelledby="hero-heading"
    >
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-xl lg:max-w-none lg:pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brown sm:text-sm">
              Perimenopause course for women 40+
            </p>
            <h1
              id="hero-heading"
              className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-[-0.02em] text-taupe sm:text-5xl lg:text-[56px] lg:leading-[1.15]"
            >
              Finally understand what&apos;s happening to your body.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-taupe sm:text-[22px] sm:leading-relaxed">
              30 video lessons explaining perimenopause and menopause from a real medical
              specialist. Lifetime access. €39 once.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <CheckoutLink
                source="hero"
                size="lg"
                className="w-full justify-center sm:w-auto"
                aria-label="Get instant access for 39 euros"
              >
                Get instant access — €39
              </CheckoutLink>
            </div>
            <p className="mt-6 flex flex-col gap-2 text-sm leading-relaxed text-brown sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1 sm:text-base">
              <span className="inline-flex items-center gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                14-day money-back guarantee
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Lifetime access
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-success" aria-hidden>
                  ✓
                </span>
                Mobile &amp; desktop
              </span>
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-col gap-10 lg:mx-0 lg:max-w-none">
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-card shadow-warm lg:aspect-[3/4]">
                <Image
                  src={HERO_IMAGE}
                  alt="Woman seated in calm, warm light — placeholder photo for the course."
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <CheckoutLink
              source="hero_image_below"
              size="lg"
              className="w-full justify-center"
              aria-label="Get started for 39 euros"
            >
              Get started — €39
            </CheckoutLink>

            <div
              className="w-full"
              aria-labelledby="hero-outline-heading"
            >
              <h2
                id="hero-outline-heading"
                className="font-heading text-2xl font-semibold tracking-tight text-taupe sm:text-3xl"
              >
                What each video covers
              </h2>
              <p className="mt-2 text-base leading-relaxed text-brown sm:text-lg">
                All 30 lessons, listed in order — so you know exactly what you&apos;re getting
                before you join.
              </p>
              <div className="mt-6 space-y-5">
                {COURSE_MODULES.map((mod) => (
                  <Card key={mod.id} className="p-5 sm:p-6">
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-taupe sm:text-xl">
                      {mod.title}
                      <span className="ml-1.5 font-sans text-base font-normal text-brown">
                        ({mod.videoCount} videos)
                      </span>
                    </h3>
                    <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-base leading-snug text-taupe marker:text-brown">
                      {mod.videos.map((title) => (
                        <li key={title}>{title}</li>
                      ))}
                    </ol>
                  </Card>
                ))}
              </div>
            </div>

            <CheckoutLink
              source="hero_curriculum_below"
              size="lg"
              className="w-full justify-center"
              aria-label="Get started for 39 euros"
            >
              Get started — €39
            </CheckoutLink>
          </div>
        </div>
      </Container>
      {/* When this leaves the viewport, the header shows the checkout CTA */}
      <div
        id="hero-sentinel"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-transparent"
        aria-hidden
      />
    </section>
  );
}
