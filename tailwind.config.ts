import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-gold": "var(--accent-gold)",
        card: "var(--card)",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
      boxShadow: {
        "soft-lg": "0 18px 60px rgba(0,0,0,0.7)",
      },
    },
  },
  plugins: [],
};

export default config;

