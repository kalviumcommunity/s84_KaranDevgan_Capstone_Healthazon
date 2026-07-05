import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        '.',
        '/home/karan-devgan/.gemini/antigravity/brain/73ea0d02-3d79-472d-9de1-a64d0fa3fe92'
      ]
    }
  }
})

