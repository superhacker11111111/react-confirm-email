/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'digital-7': ['Digital-7 Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
  env: {
    // STRIPE_ID: process.env.REACT_APP_STRIPE_ID,
    // STRIPE_KEY: process.env.REACT_APP_STRIPE_ID,
  },
};
