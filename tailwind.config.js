/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily:{
      'inter' :["Inter", "sans-serif"]
    },
    extend: {
      colors:{
        brand:{
          red: "#AF367B",
          sky: "#F2F5FF",
          black: "#222121"
        },
      },
    },
  },
  plugins: [],
}

