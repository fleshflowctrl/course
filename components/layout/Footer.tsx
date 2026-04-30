import Link from "next/link";
import { Container } from "@/components/ui/Container";

const productLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/course", label: "Course login" },
];

const legalLinks = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/refund", label: "Refund" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/imprint", label: "Imprint" },
];

export function Footer() {
  return (
    <footer className="border-t border-divider bg-beige/40">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-heading text-xl font-semibold tracking-tight text-taupe">
              Perimenopause Course
            </p>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-brown">
              Clear, medically reviewed education on perimenopause and menopause.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brown">
              Product
            </p>
            <ul className="mt-4 space-y-3">
              {productLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-11 items-center text-base text-taupe underline-offset-4 transition-colors hover:text-brown hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brown">
              Legal
            </p>
            <ul className="mt-4 space-y-3">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-11 items-center text-base text-taupe underline-offset-4 transition-colors hover:text-brown hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brown">
              Stay in touch
            </p>
            <p className="mt-4 text-base leading-relaxed text-taupe">
              Get free perimenopause tips weekly.
            </p>
            <p className="mt-2 text-sm text-brown">
              Newsletter signup will be added here. For now, use{" "}
              <a
                href="mailto:hello@example.com"
                className="font-medium text-terracotta underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                hello@example.com
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-divider pt-8 text-center text-sm text-brown">
          <p>
            © {new Date().getFullYear()} Perimenopause Course. Made with care in the
            Netherlands.
          </p>
        </div>
      </Container>
    </footer>
  );
}
