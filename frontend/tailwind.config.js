// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#dc2626',
        'brand-red-dark': '#b91c1c',
        'light-bg': '#f9fafb',
        'light-text': '#1f2937',
        'dark-bg': '#111827',
        'dark-text': '#f9fafb',
        'dark-card': '#1f2937',
      },
      fontFamily: {
        'serif-display': ['"DM Serif Display"', 'serif'],
      }
    }
  },
  plugins: [],
}