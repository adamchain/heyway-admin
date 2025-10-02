import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          table: ['@tanstack/react-table']
        }
      }
    },
    // Optimize bundle size
    minify: 'terser'
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 3000
  }
})
