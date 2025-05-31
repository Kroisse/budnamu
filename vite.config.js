import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic'
    })
  ],
  resolve: {
    alias: {
      'babel-polyfill': '@babel/polyfill',
      '/utils': './src/utils.js'
    }
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