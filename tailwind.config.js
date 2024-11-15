/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        'blink': 'blink 1.2s step-end infinite',
        'bounce-soft': 'bounce-soft 1s ease-in-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'bounce-soft': {
          '0%': { transform: 'translateY(-25%)', opacity: '0' },
          '50%': { transform: 'translateY(0)', opacity: '0.8' },
          '75%': { transform: 'translateY(-10%)', opacity: '0.9' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
