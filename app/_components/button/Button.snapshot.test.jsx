import { renderToString } from 'react-dom/server'

import { Button } from './Button'

describe('Button snapshot', () => {
  it('matches the rendered structure (as a button)', () => {
    const html = renderToString(<Button onClick={() => {}}>Refresh</Button>)

    expect(html).toMatchSnapshot()
  })
})
