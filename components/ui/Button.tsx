import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-button font-sans font-medium transition-[transform,colors,background-color,border-color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-base",
  lg: "px-8 py-3.5 text-lg",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-terracotta text-white shadow-warm hover:bg-terracotta-hover active:scale-[0.98]",
  secondary:
    "border-2 border-taupe bg-transparent text-taupe hover:bg-beige/40 active:scale-[0.98]",
  ghost:
    "bg-transparent text-taupe hover:bg-beige/30 active:scale-[0.98]",
};

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string; external?: boolean } & Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      "href" | "className" | "children"
    >)
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
);

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    const { href, external, ...anchorProps } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target="_blank"
          {...anchorProps}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
