"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackCheckoutClick } from "@/lib/analytics";
import { CHECKOUT_URL } from "@/lib/constants";

type CheckoutLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** Attribution label, e.g. "header" | "hero" */
  source: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
};

const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-button font-sans font-medium transition-[transform,colors,background-color,border-color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

const sizes = {
  md: "px-5 py-3 text-base",
  lg: "px-8 py-3.5 text-lg",
} as const;

const variants = {
  primary:
    "bg-terracotta text-white shadow-warm hover:bg-terracotta-hover active:scale-[0.98]",
  secondary:
    "border-2 border-taupe bg-transparent text-taupe hover:bg-beige/40 active:scale-[0.98]",
  ghost:
    "bg-transparent text-taupe hover:bg-beige/30 active:scale-[0.98]",
} as const;

export function CheckoutLink({
  source,
  variant = "primary",
  size = "lg",
  className = "",
  onClick,
  children,
  ...rest
}: CheckoutLinkProps) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();

  return (
    <a
      href={CHECKOUT_URL}
      className={classes}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(e) => {
        trackCheckoutClick(source);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
