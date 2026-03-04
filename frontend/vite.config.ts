import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  appType: 'spa',
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        const handler = (req: { url?: string }, _res: unknown, next: () => void) => {
          const raw = req.url ?? ''
          const pathname = raw.split('?')[0] ?? ''
          const isAsset =
            pathname.indexOf('/api') === 0 ||
            pathname.indexOf('/@') === 0 ||
            pathname.indexOf('/node_modules') === 0 ||
            /\.[a-z0-9]+$/i.test(pathname)
          if (!isAsset) {
            req.url = '/'
          }
          next()
        }
        return () => {
          const stack = server.middlewares.stack as Array<{ route: string; handle: (req: unknown, res: unknown, next: () => void) => void }>
          if (Array.isArray(stack)) stack.unshift({ route: '', handle: handler })
        }
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
