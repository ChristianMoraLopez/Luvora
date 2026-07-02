import type { Config } from "tailwindcss";

/**
 * LUVORA — Tailwind theme.
 *
 * Colors are wired to CSS custom properties (see globals.css) so the same
 * tokens can be read by Framer Motion, inline styles and JS. The raw hex
 * values are documented in src/config/tokens.ts (single source of truth).
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        burgundy: {
          DEFAULT: "#6B1E3A", // primary
          deep: "#571731", // footer / darkest brand tone
          800: "#5A1930",
          700: "#6B1E3A",
        },
        blush: {
          DEFAULT: "#D6A5B4", // secondary accent (highlight text)
          soft: "#F2E5E2", // tinted section background
          mauve: "#A96E7E", // muted eyebrow text
        },
        champagne: {
          DEFAULT: "#E8D9C5", // fills / accents
          gold: "#D9B48C", // deeper sand / gold (hover, on-dark accent)
        },
        ivory: "#F8F6F2", // page background
        ink: "#1F1F1F", // body text

        // Semantic aliases
        background: "#F8F6F2",
        foreground: "#1F1F1F",
        primary: {
          DEFAULT: "#6B1E3A",
          foreground: "#F8F6F2",
        },
        muted: {
          DEFAULT: "#F2E5E2",
          foreground: "#A96E7E",
        },
        border: "rgba(107,30,58,0.12)",
      },
      fontFamily: {
        // Loaded via next/font (see app/layout.tsx) → CSS variables.
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid editorial scale (clamp) matching the design handoff.
        "display-1": ["clamp(2.375rem, 4.6vw, 3.875rem)", { lineHeight: "1.08", fontWeight: "500" }],
        "display-2": ["clamp(1.875rem, 3.4vw, 2.625rem)", { lineHeight: "1.12", fontWeight: "500" }],
        "display-3": ["clamp(1.5rem, 2.4vw, 1.9rem)", { lineHeight: "1.2", fontWeight: "500" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.24em", fontWeight: "600" }],
      },
      letterSpacing: {
        eyebrow: "0.22em",
        wordmark: "0.3em",
        nav: "0.16em",
        promo: "0.18em",
      },
      borderRadius: {
        card: "6px",
        pill: "999px",
      },
      boxShadow: {
        // Soft, matte-friendly elevation. The reference is flat; these are
        // reserved for interactive surfaces (drawers, modals, hover lift).
        soft: "0 1px 2px rgba(31,31,31,0.04), 0 8px 24px rgba(107,30,58,0.06)",
        lift: "0 12px 40px rgba(107,30,58,0.12)",
        drawer: "0 0 60px rgba(31,31,31,0.18)",
      },
      maxWidth: {
        content: "1200px",
        prose: "46ch",
      },
      spacing: {
        section: "clamp(2.5rem, 5vw, 6.5rem)",
        gutter: "clamp(1.25rem, 4vw, 3rem)",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)", // easeOutQuint-ish, calm & fluid
        "luxe-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.12)" },
          "50%": { transform: "scale(1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s var(--ease-luxe, cubic-bezier(0.22,1,0.36,1)) both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
