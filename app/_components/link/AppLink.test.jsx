import { render } from 'vitest-browser-react'

import AppLink from './AppLink'

describe('AppLink component tests', () => {
  it('renders the AppLink with specified text and location', async () => {
    const { getByText } = await render(
      <AppLink text="View Authenticate Questions" location="/authenticate" />
    )

    const linkElement = getByText('View Authenticate Questions')
    await expect.element(linkElement).toBeInTheDocument()
    await expect.element(linkElement).toHaveAttribute('href', '/authenticate')
  })
})
