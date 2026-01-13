import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Gateway expects /api prefix based on routes?
        // Gateway routes are /api/v1/catalog -> StripPrefix=3 -> /catalogs
        // So gateway expects /api/v1/catalog/catalogs.
        // My client requests /api/v1/catalog/catalogs.
        // So NO rewrite needed for Gateway itself, as long as Gateway listens on 8088.
        // But wait, Gateway route predicates are: Path=/api/v1/catalog/**
        // So I should send /api/v1/catalog/... to localhost:8088.
      }
    }
  }
})