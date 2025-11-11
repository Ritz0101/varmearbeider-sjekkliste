/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00263A',
        primaryDark: '#003057',
        accent: '#B6CFD0',
        sand: '#B0AA7E'
      }
    },
  },
  plugins: [],
}
