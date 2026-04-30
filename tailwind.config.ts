import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border:     "oklch(var(--border))",
        input:      "oklch(var(--input))",
        ring:       "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT:    "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        // FlowSet brand palette — direct hex aliases
        brand: {
          preto:           "#0A0A0A",
          "card-dark":     "#141414",
          creme:           "#F5F0E8",
          areia:           "#C8C4BA",
          neon:            "#4AE68A",
          "verde-medio":   "#1D9E75",
          "verde-escuro":  "#085041",
          cinza:           "#666666",
          "cinza-claro":   "#9A9A9A",
        },
      },
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 3px)",
        sm:   "calc(var(--radius) - 6px)",
        full: "9999px",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
