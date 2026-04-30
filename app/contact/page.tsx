import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with the Perimenopause Course team.",
});

export default function ContactPage() {
  return (
    <div className="bg-cream py-section-y lg:py-section-y-lg">
      <Container>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-taupe sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-brown">
          Contact form and details will be added in the next build phase.
        </p>
      </Container>
    </div>
  );
}
