import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      include: '**/*.{jsx,tsx,js,ts}'
    })
  ],
  esbuild: {
    jsx: 'transform',
    loader: 'jsx',
    include: /\.(js|jsx|ts|tsx)$/,
    exclude: []
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 5173,
    open: false
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})