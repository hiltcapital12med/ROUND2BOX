/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // NUESTRA PALETA PERSONALIZADA ROUND2
      colors: {
        brand: {
          red: '#E30613',      // El rojo vibrante del logo
          dark: '#0A0A0A',     // Negro casi puro, muy sobrio
          charcoal: '#171717', // Un gris muy oscuro para contrastes
          gold: '#CBA135',     // Dorado metálico sofisticado (no amarillo)
        }
      },
      // Tipografía moderna y fuerte
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Sombras personalizadas para el efecto dorado
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(203, 161, 53, 0.25)',
      }
    },
  },
  plugins: [],
}
