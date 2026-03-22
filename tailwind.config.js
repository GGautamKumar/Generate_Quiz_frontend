/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#dde5ff",
          500: "#4f6ef7",
          600: "#3b56e8",
          700: "#2c3ec2",
          900: "#1a2460",
        },
      },
    },
  },
  plugins: [],
};