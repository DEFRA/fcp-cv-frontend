import { renderToString } from 'react-dom/server'
import { LinkToCRMContact, LinkToCRMAccount } from './link-to-crm'

describe('LinkToCRM snapshot', () => {
  it('matches the rendered structure for contact', () => {
    const html = renderToString(<LinkToCRMContact crn="123456789" />)

    expect(html).toMatchSnapshot()
  })

  it('matches the rendered structure for account', () => {
    const html = renderToString(<LinkToCRMAccount sbi="123456789" />)

    expect(html).toMatchSnapshot()
  })
})
