import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "brown": "#694D00",
      "light": {
        "brown": "#C79300",
        "orange-100": "#FFBC00",
        "orange-200": "#FFCA38",
        "orange-300": "#FFEFC3",
        "orange-200/30": "rgba(255, 202, 56, 0.3)",
      }
    },
    backgroundImage: {
      "white-list": "url(/images/top-bg-content.png)",
    },
  },
  plugins: [],
};
export default config;
