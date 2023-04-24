/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./*.hbs", "./**/*.hbs"],
  theme: {
    extend: {
      height: {
        '128': '52rem',
      }
    },
  },
  plugins: [],
}

