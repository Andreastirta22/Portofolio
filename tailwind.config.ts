import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          deep: "#050505",
          main: "#0a0a0a",
          soft: "#111111",
          card: "#1a1a1a",
        },
        text: {
          primary: "#f5f5f5",
          secondary: "#a1a1a1",
          muted: "#6b7280",
        },
        accent: {
          DEFAULT: "#7EB8C9",
          soft: "#A8D6E2",
        },
      },
    },
  },
  plugins: [],
};

export default config;
