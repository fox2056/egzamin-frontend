import path from "path"
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    base: env.VITE_EGZAMINATOR_BASE_PATH || '/egzaminator/',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_EGZAMINATOR_BASE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
