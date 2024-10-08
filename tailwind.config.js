/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: { 'background': "url('/src/ui/assets/images/image 39.png')" }
     },
     fontFamily: {
      inter: ['"Inter"', 'sans-serif']
     },
     colors: {
      blue: {
        '50': '#f2f3fc',
        '100': '#e1e4f8',
        '200': '#cad0f3',
        '300': '#a6b2ea',
        '400': '#7b8bdf',
        '500': '#5c67d5',
        '600': '#484ac8',
        '700': '#413eb7',
        '800': '#3d3796',
        '900': '#2b2964',
        '950': '#242249',
        },
      white: colors.white,
      gray: colors.gray,
      black: colors.black
     }
  },
  plugins: [],
}