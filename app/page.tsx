import { Hero } from "@/components/sections/Hero";

type HomePageProps = {
  searchParams: Promise<{ checkout?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { checkout } = await searchParams;
  const showCheckoutCancelled = checkout === "cancelled";

  return (
    <>
      {showCheckoutCancelled ? (
        <div
          className="border-b border-divider bg-beige/60 py-3 text-center text-sm text-taupe"
          role="status"
        >
          Checkout was cancelled — you were not charged. You can try again whenever
          you&apos;re ready.
        </div>
      ) : null}
      <Hero />
    </>
  );
}
