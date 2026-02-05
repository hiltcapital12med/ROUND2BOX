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
          primary: '#0a2463',    // Azul oscuro principal
          secondary: '#3e92cc',  // Azul claro secundario
          accent: '#d8315b',     // Rosa/rojo acento
          light: '#fffaff',      // Blanco crema
          dark: '#f5f5f5',       // Gris muy claro para fondos
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
