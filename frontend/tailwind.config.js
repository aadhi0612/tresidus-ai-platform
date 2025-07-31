/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
          950: '#0F1A2B',
        },
        teal: {
          50: '#EFFCF6',
          100: '#C6F7E2',
          200: '#8EEDC7',
          300: '#65D6AD',
          400: '#3EBD93',
          500: '#2DD4BF',
          600: '#27AB83',
          700: '#199473',
          800: '#147D64',
          900: '#0C6B58',
        },
        coral: {
          50: '#FFEEEE',
          100: '#FFDDDD',
          200: '#FFBBBB',
          300: '#FF9999',
          400: '#FF7777',
          500: '#FF6B6B',
          600: '#FF3333',
          700: '#FF0000',
          800: '#CC0000',
          900: '#990000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};