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
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
