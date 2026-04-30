"use client";

import { useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { trackCheckoutClick } from "@/lib/analytics";

type CheckoutLinkProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick"
> & {
  /** Attribution label, e.g. "hero" | "hero_image_below" */
  source: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
};

const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-button font-sans font-medium transition-[transform,colors,background-color,border-color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-60";

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
  children,
  disabled,
  ...rest
}: CheckoutLinkProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();

  async function handleClick() {
    trackCheckoutClick(source);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Checkout could not start");
      }
      if (!data.url) {
        throw new Error("No checkout URL returned");
      }
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex w-full max-w-full flex-col items-stretch sm:w-auto sm:items-start">
      <button
        type="button"
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        onClick={handleClick}
        {...rest}
      >
        {loading ? "Redirecting to secure checkout…" : children}
      </button>
      {error ? (
        <p className="mt-2 max-w-md text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
