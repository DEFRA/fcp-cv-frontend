import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('BusinessMessagesPage tests', () => {
  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Business messages' }))
      .toBeInTheDocument()
  })
})
