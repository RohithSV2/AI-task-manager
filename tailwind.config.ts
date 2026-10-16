import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: {
          50: "#FAF9F6",
          100: "#F6F4EE",
          200: "#ECE8DD",
          300: "#DFD9CA",
          400: "#C9BFAB",
          500: "#A99C85",
          800: "#3D372E",
          900: "#24201A",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(40, 30, 20, 0.04)',
        'warm-md': '0 4px 12px -2px rgba(40, 30, 20, 0.06), 0 2px 4px -2px rgba(40, 30, 20, 0.03)',
        'warm-lg': '0 12px 24px -4px rgba(40, 30, 20, 0.08), 0 4px 8px -2px rgba(40, 30, 20, 0.03)',
      }
    },
  },
  plugins: [],
};
export default config;
