module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jost", "sans-serif"]
      },
      colors: {
        orange: {
          "50": "#ff104109",
          "100": "#fef7f0",
          "200": "#fce0c4",
          "300": "#fac794",
          "400": "#f8b068",
          "500": "#f69637",
          "600": "#e5780a",
          "700": "#ab5908",
          "800": "#6b3805",
          "900": "#311a02"
        },

        grey: {
          "50": "#113113113",
          "100": "#f7f7f7",
          "200": "#bfbfbf",
          "300": "#858585",
          "400": "#4d4d4d",
          "500": "#141414",
          "600": "#141414",
          "700": "#171717",
          "800": "#171717",
          "900": "#1a1a1a"
        }
      },
      textColor: {
        orange: "#f69738"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
