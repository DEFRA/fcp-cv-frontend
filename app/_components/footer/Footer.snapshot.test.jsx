// Footer version is extracted from package.json, so fix the value to make the snapshot deterministic
vi.mock('../../../package.json', () => ({
  default: { version: '0.0.0' }
}))

import { renderToString } from 'react-dom/server'
import { vi } from 'vitest'
import Footer from './Footer'

describe('Footer snapshot', () => {
  it('matches the rendered structure', () => {
    const html = renderToString(<Footer />)

    expect(html).toMatchSnapshot()
  })
})
