import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
   theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          light: "#60a5fa", // blue-400
          DEFAULT: "#3b82f6", // blue-500
          dark: "#1e40af",   // blue-900
        }
      }
    },
  },
})
