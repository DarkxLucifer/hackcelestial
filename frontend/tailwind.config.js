/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        voyare: {
          coral: "#DF6951",
          gold: "#F1A501",
          navy: "#181E4B",
          darkNavy: "#14183E",
          deepNavy: "#1E1D4C",
          slate: "#5E6282",
          textMuted: "#84829A",
          charcoal: "#080809",
          cream: "#FFF1DA",
          purpleGlow: "#D5AEE4",
          violet: "#6246E5",
          indigoSoft: "#8A79DF",
          cyanAccent: "#029BC5",
          skyGlow: "#59B1E6",
        }
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        volkhov: ["Volkhov", "serif"],
        openSans: ["Open Sans", "sans-serif"],
        googleSans: ["Google Sans", "Product Sans", "sans-serif"]
      },
      boxShadow: {
        'voyare-card': '0px 100px 80px rgba(0, 0, 0, 0.02), 0px 64.8px 46.8px rgba(0, 0, 0, 0.015), 0px 20px 13px rgba(0, 0, 0, 0.01)',
        'voyare-glow': '0px 20px 35px rgba(241, 165, 1, 0.18)',
        'voyare-coral-glow': '0px 15px 30px rgba(223, 105, 81, 0.28)',
        'voyare-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
      }
    },
  },
  plugins: [],
}
