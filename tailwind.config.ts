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
        tableBackground: '#101112',
        tableHeader: '#232425',
        tableBorder: '#23323E',
        tableHover: '#26292c',
        tableTextPrimary: '#B0B0B0',
        tableTextSecondary: '#70B4E8',
        tableTextHighlight: '#E6D7BE',
        tableButtonBackground: '#1B202C',
        tableButtonText: '#6290B6',
        tableRowBackground: '#353025',
        tableTextInfo: '#4897EF',
        tableTextNotice: '#D7BC90',
        paginationButton: '#101112',
        paginationButtonBorder: '#23323E',
        paginationButtonText: '#6290B6',
        paginationText: '#4B5569',
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
        "gradient-to-r": "linear-gradient(to right, #011340, #2196FB)",
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
