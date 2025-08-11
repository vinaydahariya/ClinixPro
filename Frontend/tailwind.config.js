/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'red-primary-color': '#E83350',
        'primary-color': '#3B82F6',
        'secondary-color': '#2ecc71',
      },
    },
  },
  plugins: [],
}