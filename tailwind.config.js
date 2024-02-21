/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        hablalo_blue: "#3D47F0",
        hablalo_blue1: "#535FFF",
        hablalo_pink: "#FF377F",
        hablalo_violet: "#C73167",
        hablalo_grey: "#292929",
        hablalo_red: "#FF2424",
        hablalo_black: "#222222",
        hablalo_white: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
