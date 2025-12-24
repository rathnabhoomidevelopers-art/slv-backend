/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        allura: ["Allura", "cursive"],
        alex: ["Alex Brush", "cursive"],
        brushelva: ["Brushelva", "cursive"],
      },
    },
  },
  plugins: [],
};
