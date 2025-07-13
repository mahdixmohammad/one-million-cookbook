/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: " rgb(212,175,55)"
      },
      screens: {
        xs:"490px"
      }
    }
  },
}