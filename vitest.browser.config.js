import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

import base from './vitest.config.js'

const headless = process.env.CI === 'true' || process.env.HEADLESS === 'true'
console.log(`Running browser tests in ${headless ? 'headless' : 'headed'} mode`)

export default defineConfig({
  ...base,
  expect: {
    timeout: 2000
  },
  optimizeDeps: { include: ['react/jsx-dev-runtime'] },
  resolve: {
    ...base.resolve,
    alias: {
      ...base.resolve.alias,
      'next/link': '/test/mocks/next-link-mock.jsx'
    }
  },
  test: {
    ...base.test,
    browser: {
      enabled: true,
      headless,
      instances: [
        { browser: 'chromium', viewport: { width: 1280, height: 720 } }
      ],
      provider: playwright()
    },
    coverage: {
      ...base.test.coverage,
      all: true,
      clean: false,
      exclude: ['app/_components/iframe-messenger/IframeMessenger.jsx'],
      include: ['app/**/*.jsx', 'app/_hooks/*.js'],
      reporter: [['html'], ['json', { file: 'client-coverage.json' }]]
    },
    exclude: [
      'app/**/*.snapshot.test.jsx',
      'app/_components/iframe-messenger/IframeMessenger.test.jsx'
    ],
    include: ['app/**/*.test.jsx', 'app/_hooks/*.test.js'],
    reporters: ['default'],
    outputFile: { blob: 'coverage/merge/client-coverage.blob' },
    setupFiles: './test/setup-browser.jsx',
    timeout: 2000
    // testTimeout: 3000 // useful to limit selector timeout in failing tests
  }
})
