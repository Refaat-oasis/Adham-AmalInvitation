/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#fbe6a2',
          mid: '#d4af37',
          deep: '#99741c',
        },
        ivory: '#fdfbf7',
        celestial: '#070b14',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        cairo: ['Cairo', 'sans-serif'],
        ruqaa: ['Aref Ruqaa', 'serif'],
        script: ['Great Vibes', 'Alex Brush', 'cursive'],
        royal: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        editorial: ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}

