import { defineConfig, loadEnv } from 'vite'
import solid from 'vite-plugin-solid'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return defineConfig({
    plugins: [solid()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL.replace(/\/api$/, ''),
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    define: {
      'process.env': {}
    }
  })
}