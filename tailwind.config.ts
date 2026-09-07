import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        qul: {
          DEFAULT: "#809CCF",
          light: "#A8BEE0",
          dark: "#5F7BB0",
          tint: "#EEF2FA",
        },
        ink: {
          DEFAULT: "#1C1E21",
          soft: "#5B6270",
          faint: "#9AA1AE",
        },
        line: {
          hairline: "#E7EAF1",
        },
      },
      fontFamily: {
        sans: [
          "Noto Sans JP",
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Sans",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(28, 30, 33, 0.06)",
        softer: "0 1px 6px rgba(28, 30, 33, 0.04)",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
};
export default config;
