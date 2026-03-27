import { renderToString } from 'react-dom/server'
import Footer from './Footer'
import { vi } from 'vitest'

describe('Footer snapshot', () => {
  it('matches the rendered structure', () => {
    // Footer version is extracted from package.json, so fix the value to make the snapshot deterministic
    vi.mock('../../../package.json', () => ({
      default: { version: '0.0.0' }
    }))
    const html = renderToString(<Footer />)

    expect(html).toMatchSnapshot()
  })
})
