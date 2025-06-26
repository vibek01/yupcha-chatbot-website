// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import solid from 'vite-plugin-solid'

export default ({ mode }) => {
  // We no longer need VITE_API_URL for local dev
  return defineConfig({
    plugins: [solid()],
    server: {
      port: 3000,
      proxy: {
        // Any request to /api/* → forwarded to backend at localhost:8000
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          // no rewrite: "/api/foo" → "http://localhost:8000/api/foo"
        },
      },
    },
    define: { 'process.env': {} },
  })
}
