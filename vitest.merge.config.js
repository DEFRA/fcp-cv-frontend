import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      all: true,
      exclude: ['app/_components/iframe-messenger/IframeMessenger.test.jsx'],
      include: 'app/**/*.{js,jsx}',
      provider: 'v8',
      reporter: ['html', 'json', 'lcov', 'text'],
      thresholds: {
        branches: 95,
        functions: 95,
        lines: 95,
        statements: 95,
        perFile: false
      }
    },
    reporters: ['dot'] // quieten merge run
  }
})
