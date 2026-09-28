/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface': '#111317',
        'surface-container-lowest': '#0c0e12',
        'surface-container-low': '#1a1c20',
        'surface-container': '#1e2024',
        'surface-container-high': '#282a2e',
        'surface-container-highest': '#333539',
        'primary': '#ffb3b0',
        'primary-container': '#ff6b6b',
        'secondary': '#bcc7dd',
        'tertiary': '#4cd6ff',
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
