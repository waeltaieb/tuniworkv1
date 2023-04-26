/** @type {import('tailwindcss').Config} */
module.exports = {
  content:  ["./views/**/*.{html,hbs}", "./*.{html,hbs,js}"],
  theme: {
    extend: {
      height: {
        '128': '52rem',
      }
    },
  },
  plugins: [],
}

