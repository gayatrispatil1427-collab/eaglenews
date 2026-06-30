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
        primary: {
          DEFAULT: '#D60000',
          hover: '#B50000',
          light: '#FFF0F0',
        },
        secondary: {
          DEFAULT: '#111111',
          hover: '#000000',
          light: '#222222',
        },
        accent: {
          DEFAULT: '#FFD700',
          hover: '#E5C100',
        },
        brandBg: {
          light: '#F8F9FA',
          dark: '#0E0E10',
        },
        brandCard: {
          light: '#FFFFFF',
          dark: '#1A1A1E',
        }
      },
      fontFamily: {
        heading: ['Mukta', 'sans-serif'],
        body: ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -1px rgba(0, 0, 0, 0.03)',
        premiumDark: '0 4px 25px -2px rgba(0, 0, 0, 0.3), 0 2px 15px -1px rgba(0, 0, 0, 0.2)',
        glow: '0 0 15px rgba(214, 0, 0, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}


