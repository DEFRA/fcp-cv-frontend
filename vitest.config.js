import path from 'path'
import { loadEnv } from 'vite'
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
    },
    env: loadEnv('test', process.cwd(), '')
  },
  esbuild: {
    loader: 'jsx',
    jsx: 'automatic'
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, 'app', '_components'),
      '@/hooks': path.resolve(__dirname, 'app', '_hooks'),
      '@/lib': path.resolve(__dirname, 'app', '_lib'),
      '@/config': path.resolve(__dirname, 'config.js')
    }
  }
})
