/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'punk-red': '#ff3333',
        'punk-black': '#121212',
        'punk-yellow': '#ffcc00',
      },
      fontFamily: {
        'marker': ['"Permanent Marker"', 'cursive'],
        'sans': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'punk': '5px 5px 0px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
}

