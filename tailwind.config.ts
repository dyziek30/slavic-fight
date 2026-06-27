import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta zgodna z logo: czerń / ciemna szarość / biel
        ink: "#000000",
        carbon: "#0a0a0a",
        coal: "#111113",
        graphite: "#1a1a1d",
        steel: "#222226",
        ash: "#2e2e33",
        smoke: "#9a9aa2",
        chalk: "#f4f4f5",
        // dyskretny akcent (używany oszczędnie, np. status, hover)
        blood: "#c1121f",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.18em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
