import path from 'node:path'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    loader: 'jsx'
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, 'app', '_components'),
      '@/hooks': path.resolve(__dirname, 'app', '_hooks'),
      '@/lib': path.resolve(__dirname, 'app', '_lib'),
      '@/config': path.resolve(__dirname, 'config.js')
    }
  },
  test: {
    clearMocks: true,
    coverage: {
      exclude: [
        'app/**/page.jsx',
        'app/_components/iframe-messenger/IframeMessenger.jsx',
        'app/_hooks',
        'app/linked-contacts'
      ],
      include: 'app/**/*.{js,jsx}',
      provider: 'v8',
      reporter: [['json', { file: 'server-coverage.json' }]]
    },
    env: loadEnv('test', process.cwd(), ''),
    environment: 'node',
    exclude: ['app/**/page.jsx', 'app/_hooks'],
    include: ['app/**/*.test.js', 'app/**/*.snapshot.test.jsx'],
    globals: true,
    reporters: ['default'],
    outputFile: { blob: 'coverage/merge/server-coverage.blob' },
    timeout: 1000
  }
})
