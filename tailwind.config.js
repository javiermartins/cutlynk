/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {
      animation: {
        'fade-in-left': 'fade-in-left 0.5s ease-in-out forwards',
        'fade-in-bottom': 'fade-in-bottom 0.5s ease-in-out forwards',
      },
      keyframes: {
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-bottom': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};