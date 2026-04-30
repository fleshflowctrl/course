import type { HTMLAttributes } from "react";

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card bg-card shadow-warm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
