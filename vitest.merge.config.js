import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      all: true,
      exclude: ['app/**/*.test.{js,jsx}', 'app/**/*.snapshot.test.jsx'],
      include: 'app/**/*.{js,jsx}',
      provider: 'v8',
      reporter: ['html', 'json', 'text'],
      thresholds: { 100: true, perFile: true }
    }
  }
})
