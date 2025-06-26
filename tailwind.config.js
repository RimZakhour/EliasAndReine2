/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",      // if you use app/
      "./pages/**/*.{js,ts,jsx,tsx}",    // if you use pages/
      "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          cream: "#FFF8F0",
          gold:  "#C59A6B",
        },
      },
    },
    plugins: [],
  };
  