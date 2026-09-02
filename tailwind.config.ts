import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        skinora: {
          50: '#FDFBF9',
          100: '#F9F5F0',
          200: '#F2E8DC',
          300: '#E4D1BF',
          400: '#CDB19B',
          500: '#A9876F',
          600: '#8C6C55',
          700: '#6B503D',
          800: '#4E3A2D',
          900: '#2A1F18',
        },
        rose: {
          soft: '#F8EFF0',
          quartz: '#E8D4D8',
          accent: '#D9777F',
        },
        emerald: {
          glow: '#059669',
          soft: '#ECFDF5',
        },
        amber: {
          glow: '#D97706',
          soft: '#FFFBEB',
        },
        slate: {
          charcoal: '#111827',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
        'glow-rose': '0 0 30px -5px rgba(232, 212, 216, 0.6)',
        'glow-emerald': '0 0 30px -5px rgba(5, 150, 105, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
