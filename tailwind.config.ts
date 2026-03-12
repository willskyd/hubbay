import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hubbay: {
          emerald: "rgb(var(--hubbay-primary-emerald) / <alpha-value>)",
          gold: "rgb(var(--hubbay-accent-gold) / <alpha-value>)",
          background: "rgb(var(--hubbay-background) / <alpha-value>)",
          surface: "rgb(var(--hubbay-surface) / <alpha-value>)",
          text: "rgb(var(--hubbay-text) / <alpha-value>)",
          secondary: "rgb(var(--hubbay-secondary) / <alpha-value>)",
          divider: "rgb(var(--hubbay-divider) / <alpha-value>)",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(212,175,55,0.24), 0 16px 44px rgba(31,122,79,0.14)",
      },
      backgroundImage: {
        "emerald-gold":
          "linear-gradient(120deg, #1F7A4F 0%, #2d9560 40%, #8b8f4f 68%, #D4AF37 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
