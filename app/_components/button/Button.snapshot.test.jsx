import { renderToString } from 'react-dom/server'

import { Button, ExternalLinkButton } from './Button'

describe('Button snapshot', () => {
  it('matches the rendered structure (as a button)', () => {
    const html = renderToString(<Button onClick={() => {}}>Refresh</Button>)

    expect(html).toMatchSnapshot()
  })

  it('matches the rendered structure (as an external link)', () => {
    const html = renderToString(
      <ExternalLinkButton href="/customer">View customer</ExternalLinkButton>
    )

    expect(html).toMatchSnapshot()
  })
})
