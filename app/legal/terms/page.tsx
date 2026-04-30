import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Terms & Conditions",
  description: "Terms of use for the Perimenopause Course.",
});

export default function TermsPage() {
  return (
    <div className="bg-cream py-section-y lg:py-section-y-lg">
      <Container>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-taupe">
          Terms &amp; Conditions
        </h1>
        <p className="mt-6 max-w-2xl text-brown">
          {/* TODO: Replace with lawyer-reviewed terms. */}
          Placeholder legal text. This page must be reviewed by a qualified lawyer before
          publication.
        </p>
      </Container>
    </div>
  );
}
