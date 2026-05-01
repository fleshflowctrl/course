"use client";

import { useEffect, useId, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { X } from "lucide-react";
import { trackCheckoutClick } from "@/lib/analytics";
import { PACKAGES, type PackageId } from "@/lib/packages";

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
  const dialogTitleId = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PackageId>(PACKAGES[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();

  function openPicker() {
    setError(null);
    setOpen(true);
  }

  async function startCheckout() {
    setError(null);
    setLoading(true);
    trackCheckoutClick(source, selected);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: selected }),
      });
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
        disabled={disabled}
        onClick={openPicker}
        {...rest}
      >
        {children}
      </button>
      {error && !open ? (
        <p className="mt-2 max-w-md text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close package picker"
            onClick={() => {
              setOpen(false);
              setLoading(false);
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="relative z-[101] flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col rounded-t-card border border-divider bg-cream shadow-warm sm:max-h-[85vh] sm:rounded-card"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-divider px-5 py-4 sm:px-6">
              <h2
                id={dialogTitleId}
                className="font-heading text-xl font-semibold tracking-tight text-taupe sm:text-2xl"
              >
                Choose your package
              </h2>
              <button
                type="button"
                className="rounded-full p-1.5 text-brown hover:bg-beige/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                onClick={() => {
                  setOpen(false);
                  setLoading(false);
                }}
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              <fieldset className="space-y-3">
                <legend className="sr-only">Course access level</legend>
                {PACKAGES.map((pkg) => {
                  const id = `pkg-${pkg.id}`;
                  const checked = selected === pkg.id;
                  return (
                    <label
                      key={pkg.id}
                      htmlFor={id}
                      className={`flex cursor-pointer flex-col gap-1 rounded-card border-2 p-4 transition-colors sm:p-4 ${
                        checked
                          ? "border-terracotta bg-white/80"
                          : "border-transparent bg-card/80 hover:border-divider"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          id={id}
                          type="radio"
                          name="package"
                          value={pkg.id}
                          checked={checked}
                          onChange={() => setSelected(pkg.id)}
                          className="mt-1 h-4 w-4 shrink-0 accent-terracotta"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                            <span className="font-heading text-lg font-semibold text-taupe">
                              {pkg.title}
                            </span>
                            <span className="font-sans text-lg font-semibold text-terracotta">
                              {pkg.label}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-sm font-medium text-brown">
                            {pkg.subtitle}
                          </span>
                          <span className="mt-2 block text-sm leading-relaxed text-taupe">
                            {pkg.description}
                          </span>
                        </span>
                      </div>
                    </label>
                  );
                })}
              </fieldset>
            </div>

            <div className="shrink-0 space-y-2 border-t border-divider bg-cream/95 px-5 py-4 sm:px-6">
              {error ? (
                <p className="text-sm text-error" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className={`${base} ${sizes.md} ${variants.secondary} w-full sm:w-auto`}
                  disabled={loading}
                  onClick={() => {
                    setOpen(false);
                    setLoading(false);
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${base} ${sizes.md} ${variants.primary} w-full sm:w-auto`}
                  disabled={loading}
                  aria-busy={loading}
                  onClick={startCheckout}
                >
                  {loading ? "Redirecting to secure checkout…" : "Continue to payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
