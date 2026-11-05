/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#234B35',
          dark: '#173B2B',
          light: '#2D5E43',
          hover: '#1E412E',
        },
        sage: {
          DEFAULT: '#8DAA91',
          light: '#AEC4B2',
          muted: '#C4D5C7',
          soft: '#E8EFE9',
        },
        cream: {
          DEFAULT: '#F7F5EC',
          light: '#FCFBF7',
          dark: '#ECE8DB',
        },
        beige: {
          DEFAULT: '#E9E4D5',
          light: '#F2EFE6',
          dark: '#D8D1BD',
        },
        expiry: {
          fresh: '#2E7D32',
          freshBg: '#E8F5E9',
          freshBorder: '#C8E6C9',
          warning: '#B7791F',
          warningBg: '#FEF3C7',
          warningBorder: '#FDE68A',
          danger: '#C53030',
          dangerBg: '#FEE2E2',
          dangerBorder: '#FECACA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(35, 75, 53, 0.05), 0 4px 6px -2px rgba(35, 75, 53, 0.02)',
        'card': '0 4px 20px -2px rgba(35, 75, 53, 0.08)',
        'elevated': '0 10px 30px -5px rgba(35, 75, 53, 0.12)',
      }
    },
  },
  plugins: [],
}

