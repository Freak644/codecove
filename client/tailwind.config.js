/** @type {import('tailwindcss').Config} */
// tailwind.config.js
// ChatApp/tailwind.config.js
export default {
  darkMode: "class", // <-- important
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    //"./**/*.{js,jsx,ts,tsx}", // if you have shared components
  ],
 theme: {
    extend: {
    },
  },
  plugins: [],
}


