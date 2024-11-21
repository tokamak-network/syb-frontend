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
        primary: '#011340',
        secondary: '#2196FB',
        background: "var(--background)",
        foreground: "var(--foreground)",
        "dialog-tab-border": "#474374",
        "dialog-tab-active": "#0E0B30",
        "dialog-tab-hover": "#9E66ED",
        "dialog-tab-text": "#A982E0",
        "dialog-background": "#1B153F",
        "dialog-content": "#0E0B30",
        "dialog-content-border": "#9E66ED"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        narnoor: ["Narnoor", "sans-serif"],
        abhaya: ["Abhaya Libre", "sans-serif"],
        acme: ["Acme", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
        anekDevanagari: ["Anek Devanagari", "sans-serif"],
      },
      backgroundImage: {
        "gradient-to-r": "linear-gradient(to right, #30CEDF, #1940B5)",
        "rank-card-gradient-to-r":
          "linear-gradient(to right, #BF3A3A, #591B1B)",
        "item-per-page-label": "linear-gradient(to right, #1E77B8, #A029BE)",
        "modal-primary": "linear-gradient(45deg, #19163B, #4C09A1)",
        "dialog-button": "linear-gradient(90deg, #4C9AED, #6C66E1, #9D62EF)"
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
