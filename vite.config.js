import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

  // https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  const isTunnel = mode === 'tunnel'; // Custom mode for tunnel usage
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

  return {
    base: '/',
    plugins: [react()],
    define: {
      global: {},
    },
    server: {
      allowedHosts: true,
      fs: {
        allow: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname)
        ]
      },
      proxy: {
        '/api/v1': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
