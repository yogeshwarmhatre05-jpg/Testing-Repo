/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Ledger" palette — deep indigo-slate workspace with a warm
        // amber accent for the user's own actions, and a cool signal-blue
        // reserved for the assistant. Kept out of the generic
        // cream/terracotta and pure-black/neon presets.
        ink: {
          950: "#0F1116",
          900: "#14161C",
          800: "#1C1F27",
          700: "#262A34",
          600: "#343947",
          500: "#4A5063",
        },
        paper: {
          50: "#FAFAF8",
          100: "#F2F1ED",
          200: "#E6E4DD",
        },
        amber: {
          400: "#F0B052",
          500: "#E8A33D",
          600: "#C6822A",
        },
        signal: {
          400: "#87A0F7",
          500: "#6C8EF5",
          600: "#4F6FDB",
        },
      },
      fontFamily: {
        sans: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        pulseWave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        pulseWave: "pulseWave 0.9s ease-in-out infinite",
        slideIn: "slideIn 0.18s ease-out",
      },
    },
  },
  plugins: [],
};