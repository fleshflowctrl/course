"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { PlatformLoginLink } from "@/components/ui/PlatformLoginLink";

export function Header() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { root: null, rootMargin: "0px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-200 ease-out ${
        pastHero
          ? "border-divider bg-card/95 shadow-warm backdrop-blur-sm"
          : "border-transparent bg-cream/90 backdrop-blur-sm"
      }`}
    >
      <Container className="flex h-[4.25rem] min-h-[4.25rem] items-center justify-between gap-3">
        <Link
          href="/"
          className="min-w-0 shrink font-heading text-lg font-semibold tracking-tight text-taupe focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:text-xl md:text-2xl"
        >
          <span className="truncate sm:whitespace-normal">
            Perimenopause Course
          </span>
        </Link>

        <div className="flex shrink-0 items-center">
          <PlatformLoginLink
            size="md"
            className="max-w-[11rem] whitespace-nowrap sm:max-w-none"
            aria-label="Go to the log in page"
          >
            <span className="sm:hidden">Log in</span>
            <span className="hidden sm:inline">Log in to your courses</span>
          </PlatformLoginLink>
        </div>
      </Container>
    </header>
  );
}
