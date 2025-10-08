import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    allowedHosts: [
      'noninterpolative-sincere-velva.ngrok-free.dev',
      'all'
    ]
  }
})