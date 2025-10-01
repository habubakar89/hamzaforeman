/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: '#0b0f19',
          800: '#111827',
        },
        gold: '#f5e6c4',
        rose: '#ff8fa3',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Lora', 'serif'],
        playfair: ['"Playfair Display"', 'serif'], // Legacy support
        poppins: ['Poppins', 'sans-serif'], // Legacy support
      },
    },
  },
  plugins: [],
}
