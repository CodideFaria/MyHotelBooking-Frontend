/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': '#079890',
        'brand-hover': '#06827b',
        'brand-secondary': '#6dc330',
        'brand-secondary-hover': '#569926'
      },
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
