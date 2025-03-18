/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Source-Serif': ['"Source Serif 4"', 'serif'],
      },
      colors: {
        'backgroundcolor2': "#E7DAED"
      }
    },
  },
  plugins: []
}
