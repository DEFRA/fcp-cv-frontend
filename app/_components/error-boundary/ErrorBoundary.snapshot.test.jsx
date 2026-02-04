import { renderToString } from 'react-dom/server'
import { vi } from 'vitest'

import { ErrorBoundary } from './ErrorBoundary'

function renderBoundary({ hasError = false, error = null, children }) {
  const boundary = new ErrorBoundary({ children })
  boundary.state = { hasError, error }

  return renderToString(boundary.render())
}

describe('ErrorBoundary snapshot', () => {
  it('renders children when there is no error', () => {
    const html = renderBoundary({
      hasError: false,
      children: <div data-testid="child">OK</div>
    })

    expect(html).toMatchSnapshot()
  })

  it('renders fallback UI when there is an error', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2020-01-01T00:00:00.000Z'))

    // Stabilise snapshot output across Node versions/OS.
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgent: 'test-user-agent',
        platform: 'test-platform',
        language: 'test-language'
      }
    })

    const html = renderBoundary({
      hasError: true,
      error: new Error('Some error'),
      children: <div data-testid="child">OK</div>
    })

    expect(html).toMatchSnapshot()

    vi.useRealTimers()
  })
})
