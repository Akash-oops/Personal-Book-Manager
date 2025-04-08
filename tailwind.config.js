// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // since you're toggling 'dark' class
  theme: {
    extend: {},
  },
  plugins: [],
}
