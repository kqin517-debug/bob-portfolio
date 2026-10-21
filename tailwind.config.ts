import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: "#08090E",
        midnight: "#0F121C",
        glass: {
          surface: "rgba(22, 27, 42, 0.65)",
          surfaceHover: "rgba(30, 36, 56, 0.75)",
          border: "rgba(223, 232, 255, 0.16)",
          borderHover: "rgba(223, 232, 255, 0.32)",
          shine: "rgba(255, 255, 255, 0.12)",
        },
        accent: {
          blue: "#3865FF",
          cyan: "#00E5FF",
          emerald: "#21FF6B",
          neonOrange: "#FF4C24",
          purple: "#7F56D9",
        },
      },
      boxShadow: {
        glass: "0 20px 50px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)",
        "glass-sm": "0 8px 24px -6px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
        "glass-active": "0 0 25px rgba(56, 101, 255, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)",
        glow: "0 0 20px rgba(56, 101, 255, 0.5)",
        "glow-emerald": "0 0 16px rgba(33, 255, 107, 0.6)",
        "glow-orange": "0 0 16px rgba(255, 76, 36, 0.6)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      backdropBlur: {
        glass: "20px",
        "glass-lg": "40px",
      },
      animation: {
        // Used by the Sidebar "Star on GitHub" Sparkles icon.
        // 8s linear infinite keeps the slow ambient rotation of the glass UI.
        "spin-slow": "spin-slow 8s linear infinite",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
