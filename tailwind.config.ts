import type { Config } from "tailwindcss";

/**
 * Design system theme extensions (per spec).
 * Loaded via `@config` in `app/globals.css` (Tailwind v4).
 */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF6F0",
        card: "#FFFFFF",
        beige: "#E8DFD3",
        taupe: "#4A3F36",
        brown: "#8B7355",
        sage: "#A8B5A0",
        terracotta: {
          DEFAULT: "#C97B5E",
          hover: "#B86B4F",
        },
        divider: "#EDE5D8",
        error: "#B85C5C",
        success: "#7A9A7E",
      },
      fontFamily: {
        heading: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 4px 24px rgba(74, 63, 54, 0.08)",
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        modal: "24px",
      },
      spacing: {
        "section-y": "5rem",
        "section-y-lg": "7.5rem",
      },
    },
  },
} satisfies Config;
