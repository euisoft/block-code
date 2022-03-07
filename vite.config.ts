import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BlockCode'
    },
    rollupOptions: {
      plugins: [
        typescript({
          exclude: ['**/stories/*', '**/*.test.*']
        })
      ],
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'react'
        }
      }
    }
  }
})
