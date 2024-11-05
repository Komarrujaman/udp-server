/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'nuero' : '17px 17px 46px #020a0d, -17px -17px 46px #082635'
      }
    },
    colors: {
      'main': '#051821',
      'background': '#e5e5e5',
      'amber': {
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      }
    }
  },
  plugins: [],
});
