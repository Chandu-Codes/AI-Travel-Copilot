/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#F5EFE6',
          canvas: '#EDE4D6',
          surface: '#FFFFFF',
          'surface-alt': '#FAF6F0',
          'surface-muted': '#F0E7DA',
          dark: '#0C0A09',       // Deep high-contrast black
          charcoal: '#1C1917',
          muted: '#44403C',      // Crisp readable dark text
          'muted-light': '#78716C',
          border: '#DDCFBD',
          'border-light': '#EADECE',
          gold: '#D97706',
          sand: '#E5D6C3',
        },
        terracotta: {
          50: '#FDF6F2',
          100: '#FDECE4',
          200: '#FBD8CB',
          300: '#F5BAA2',
          400: '#EB8F6F',
          500: '#C7532B',
          600: '#9E3816',      // Exact reference terracotta
          700: '#832C0E',
          800: '#6C240B',
          900: '#4D1A08',
          DEFAULT: '#9E3816',
        },
        brand: {
          50: '#FDF6F2',
          100: '#FDECE4',
          500: '#9E3816',
          600: '#9E3816',
          700: '#832C0E',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'warm-sm': '0 2px 10px -2px rgba(12, 10, 9, 0.05)',
        'warm': '0 6px 24px -4px rgba(12, 10, 9, 0.08)',
        'warm-lg': '0 16px 40px -8px rgba(12, 10, 9, 0.12)',
        'terracotta': '0 8px 24px -4px rgba(158, 56, 22, 0.35)',
      }
    },
  },
  plugins: [],
}
