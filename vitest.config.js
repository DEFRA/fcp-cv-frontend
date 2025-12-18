import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    clearMocks: true,
    css: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      include: '{app,components}/**/*.{js,jsx}'
    }
  },
  esbuild: {
    loader: 'jsx',
    jsx: 'automatic'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app')
    }
  }
})
