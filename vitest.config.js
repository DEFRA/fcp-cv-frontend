import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      include: 'app/**/*.{js,jsx}'
    }
  },
  esbuild: {
    loader: 'jsx',
    jsx: 'automatic'
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, 'app', '_components'),
      '@/lib': path.resolve(__dirname, 'app', '_lib')
    }
  }
})
