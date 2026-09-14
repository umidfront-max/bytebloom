import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Nisbiy yo'llar — GitHub Pages (/bytebloom/) va istalgan boshqa hostingda ishlaydi
  base: './',
})
