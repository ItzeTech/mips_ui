/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      // Add custom animations, transitions, colors, etc.
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        }
      },
      zIndex: {
        '52': '52',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: for better form styling
  ],
}
