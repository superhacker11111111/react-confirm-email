/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  env: {
    // STRIPE_ID: process.env.REACT_APP_STRIPE_ID,
    // STRIPE_KEY: process.env.REACT_APP_STRIPE_ID,
  },
};
