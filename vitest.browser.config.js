import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

import base from './vitest.config.js'

const headless = process.env.CI === 'true' || process.env.HEADLESS === 'true'
console.log(`Running browser tests in ${headless ? 'headless' : 'headed'} mode`)

export default defineConfig({
  ...base,
  expect: {
    timeout: 2000
  },
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
      include: ['app/**/*.jsx'],
      reporter: [['html'], ['json', { file: 'client-coverage.json' }]]
    },
    exclude: [
      'app/**/*.snapshot.test.jsx',
      'app/_components/iframe-messenger/IframeMessenger.test.jsx'
    ],
    include: ['app/**/*.test.jsx'],
    reporters: ['default'],
    outputFile: { blob: 'coverage/merge/client-coverage.blob' },
    setupFiles: './test/setup-browser.jsx',
    timeout: 2000
    // testTimeout: 3000 // useful to limit selector timeout in failing tests
  }
})
