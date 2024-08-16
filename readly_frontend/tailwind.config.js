/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-right': 'slideRight 20s linear infinite',
      },
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
    colors: {
      'custom-highlight': '#549CB9',
      'custom-border': '#D3D3D3',
    },
    fontFamily: {
      BM_HANNA: ["BM_HANNA"],
    },
  },
  plugins: [],
}