import { renderToString } from 'react-dom/server'
import { Main } from '@/components/main/main'
import { vi } from 'vitest'

describe('Main snapshot', () => {
  it('matches the rendered structure', () => {
    // Footer version is extracted from package.json, so fix the value to make the snapshot deterministic
    vi.mock('../../../package.json', () => ({
      default: { version: '0.0.0' }
    }))
    const html = renderToString(<Main />)

    expect(html).toMatchSnapshot()
  })
})
