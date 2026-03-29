// tailwind.config.js
// Tailwind CSS konfigurace s vlastní paletou pro AutoGaráž dark theme
/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind skenuje tyto soubory pro použité třídy (tree-shaking)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // darkMode: 'class' – dark mode se aktivuje přidáním třídy 'dark' na <html>
  darkMode: 'class',

  theme: {
    extend: {
      // Vlastní barvy pro AutoGaráž
      colors: {
        // Primární tmavé pozadí
        garage: {
          bg: '#0a0a0a',         // Nejhlubší pozadí
          surface: '#141414',     // Karta/panel pozadí
          elevated: '#1e1e1e',    // Zvýšený povrch
          border: '#2a2a2a',      // Jemné ohraničení
          muted: '#3a3a3a',       // Méně výrazné elementy
        },
        // Akcenty
        accent: {
          gold: '#c9a84c',        // Zlatá pro prémiový feel
          'gold-light': '#e8c76a',
          'gold-dark': '#a07830',
          red: '#e03030',         // Červená (sportovní)
          blue: '#3b82f6',        // Modrá (BMW)
          silver: '#94a3b8',      // Stříbrná
        },
      },

      // Vlastní fonty
      fontFamily: {
        // Display font pro nadpisy – elegantní, automobilový
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        // Body font – čistý a moderní
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        // Mono pro technické specifikace
        mono: ['JetBrains Mono', 'monospace'],
      },

      // Animace
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(201, 168, 76, 0.15)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },

      // Box shadows pro elevated komponenty
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'gold': '0 0 20px rgba(201, 168, 76, 0.3)',
        'nav': '0 -1px 30px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
}
