import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'noninterpolative-sincere-velva.ngrok-free.dev',
      'localhost',
    ],
  },
})