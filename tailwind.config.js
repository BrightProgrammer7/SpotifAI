/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noev", "sans-serif"],
        neov: ["Noev", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "bg-home": "url('spotifai.png')",
      },
      zIndex: {
        100: "100",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4C0378",

          secondary: "#4F0147",

          accent: "#35012C",

          neutral: "#FCFCFC",

          "base-100": "#11001C",

          info: "#13012f",

          btn: "#11001C",

          success: "#80ced1",

          warning: "#efd8bd",

          error: "#e58b8b",
          "nav-color": "#130120",
        },
      },
    ],
  },
  // plugins: [import("daisyui")],
  plugins: [require("daisyui")],
};
