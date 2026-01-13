import { renderToString } from 'react-dom/server'

import { Button } from './Button'

describe('Button snapshot', () => {
  it('matches the rendered structure', () => {
    const html = renderToString(<Button href="/customer">View customer</Button>)

    expect(html).toMatchSnapshot()
  })
})
