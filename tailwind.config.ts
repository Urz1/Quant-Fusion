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
        canvas: {
          page: "#ECE8DF",
          slate: "#0F172A",
        },
        surface: {
          sheet: "#FFFFFF",
          recessed: "#DFDACF",
          muted: "#E5E1D7",
        },
        border: {
          rule: "#D5D0C5",
          dark: "#1E293B",
        },
        ink: {
          primary: "#1A1714",
          secondary: "#4A463F",
          muted: "#6B665C",
          light: "#F8FAFC",
        },
        btn: {
          cta: "#0F663E",
          ctaHover: "#0A4F30",
        },
        link: {
          interactive: "#164E87",
          interactiveHover: "#0E3A66",
        },
        stamp: {
          ink: "#0D4E30",
          wash: "#E6F3EC",
        },
        friction: {
          crimson: "#8A1C14",
          wash: "#F7DFDE",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      boxShadow: {
        sheet: "0 1px 3px rgba(0, 0, 0, 0.04), 0 12px 24px -8px rgba(26, 23, 20, 0.05)",
        card: "0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 8px -2px rgba(26, 23, 20, 0.04)",
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "2px",
        md: "4px",
      },
    },
  },
  plugins: [],
};
export default config;
