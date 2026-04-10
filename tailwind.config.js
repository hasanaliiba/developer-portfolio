/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: { accent: '#22c55e' },
      fontFamily: { mono: ['"Fira Code"', '"Cascadia Code"', 'monospace'] },
    },
  },
  plugins: [],
};
