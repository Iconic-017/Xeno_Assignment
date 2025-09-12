import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react() , tailwindcss()],
   theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          light: "#60a5fa",
          DEFAULT: "#3b82f6",
          dark: "#1e40af",  
        }
      }
    },
  },
})
