import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      all: true,
      exclude: ['app/_components/iframe-messenger/IframeMessenger.test.jsx'],
      include: 'app/**/*.{js,jsx}',
      provider: 'v8',
      reporter: ['html', 'json', 'text'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
        perFile: true
      }
    }
  }
})
