/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./build/index.html",
    "./build/pages/*.{html,js}"
],
  theme: {
    extend: 
    {
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle, rgba(76,61,61,1) 0%, rgba(45,42,42,1) 100%)',
        'radial-gradient-transparent': 'none',
      },
      fontFamily: {
        'bebasneue': ['Bebas Neue', 'sans-serif']
      }
    },
  },
  plugins: [],
}

