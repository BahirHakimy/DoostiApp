/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00dbe7',
        light: '#4be9e8',
        secondary: '#f89f29',
        darkblue: '#00b0f4',
        dark: '#06141e',
      },
    },
  },
  plugins: [],
};

