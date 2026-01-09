import { renderToString } from 'react-dom/server'
import AppLink from './AppLink'

describe('AppLink snapshot', () => {
  it('matches the rendered structure', () => {
    const html = renderToString(
      <AppLink text="View Authenticate Questions" location="/authenticate" />
    )

    expect(html).toMatchSnapshot()
  })
})
