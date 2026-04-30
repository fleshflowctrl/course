"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-button bg-terracotta font-sans font-medium text-white shadow-warm transition-[transform,colors,background-color] duration-200 ease-out hover:bg-terracotta-hover active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

const sizes = {
  md: "px-4 py-3 text-sm sm:px-5 sm:text-base",
  lg: "px-8 py-3.5 text-lg",
} as const;

export type PlatformLoginLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "className"
> & {
  size?: keyof typeof sizes;
  className?: string;
};

export function PlatformLoginLink({
  size = "md",
  className = "",
  children,
  ...rest
}: PlatformLoginLinkProps) {
  const classes = `${base} ${sizes[size]} ${className}`.trim();

  return (
    <Link href="/login" className={classes} {...rest}>
      {children}
    </Link>
  );
}
