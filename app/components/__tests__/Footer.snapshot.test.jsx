import { renderToString } from 'react-dom/server'
import Footer from '../Footer'

describe('Footer snapshot', () => {
  it('matches the rendered structure', () => {
    const html = renderToString(<Footer />)

    expect(html).toMatchSnapshot()
  })
})

