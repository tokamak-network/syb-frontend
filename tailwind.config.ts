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
      },
      backgroundImage: {
        "gradient-to-r": "linear-gradient(to right, #30CEDF, #1940B5)",
        "rank-card-gradient-to-r":
          "linear-gradient(to right, #BF3A3A, #591B1B)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
