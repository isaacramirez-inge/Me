/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx}",
    "./src/pages/**/*.{astro,js,jsx,ts,tsx}",
    "./src/layouts/**/*.{astro,js,jsx,ts,tsx}",
    "./src/components/**/*.{astro,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {}, 
    screens: {
      'xs': { 'max': '767px' }, // hasta 767px
      'md': '768px',            // de 768px hacia arriba
    }, 
  },
  plugins: [],
};