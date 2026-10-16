import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], server: { port: 5173, proxy: { '/api': { target: 'http://127.0.0.1:3003', changeOrigin: true } } }, test: { environment: 'jsdom', setupFiles: ['./testSetup.js'], exclude: ['node_modules/**','dist/**'] } })
