/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0d1117",
        light: "#f1f1f1",
      },
      screens: {
        lowheight: { raw: "(max-height: 730px)" },
        medheight: { raw: "(max-height: 800px)" },
      },
    },
  },
  plugins: [],
};
