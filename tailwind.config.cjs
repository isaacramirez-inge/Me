/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx}",
    "./src/pages/**/*.{astro,js,jsx,ts,tsx}",
    "./src/layouts/**/*.{astro,js,jsx,ts,tsx}",
    "./src/components/**/*.{astro,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        vibration: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '50%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
      },
      animation: {
        vibration: 'vibration 0.3s ease-in-out infinite',
      },
    }, 
    screens: {
      'xs': { 'max': '767px' }, // hasta 767px
      'md': '768px',            // de 768px hacia arriba
    }, 
  },
  plugins: [],
};