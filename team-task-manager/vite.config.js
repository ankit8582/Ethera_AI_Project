import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [
    react({
      fastRefresh: command === 'serve',
    }),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      'ethera-frontend-production.up.railway.app'
    ]
  }
}))
