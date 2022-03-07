import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: 'setupTests.ts'
  },
  resolve: {
    alias: {
      plugins: resolve(__dirname, 'src/plugins'),
      utils: resolve(__dirname, 'src/utils'),
      hooks: resolve(__dirname, 'src/hooks'),
      data: resolve(__dirname, 'src/data')
    }
  }
})
