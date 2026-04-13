import { renderToString } from 'react-dom/server'

import { ButtonLink } from './ButtonLink'

describe('ButtonLink snapshot', () => {
  it('matches the rendered structure', () => {
    const html = renderToString(
      <ButtonLink onClick={() => {}}>Click here</ButtonLink>
    )

    expect(html).toMatchSnapshot()
  })
})
