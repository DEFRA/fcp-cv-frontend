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

  it('renders the AppLink with specified text with no link if no location is specified', async () => {
    const { getByText, getByRole } = await render(
      <AppLink text="View Authenticate Questions" />
    )

    const linkElement = getByText('View Authenticate Questions')
    await expect.element(linkElement).toBeInTheDocument()
    expect(getByRole('link')).not.toBeInTheDocument()
  })

  it('includes the AppLink even if text is not specified', async () => {
    const { getByText, getByRole } = await render(
      <AppLink location="/authenticate" />
    )
    expect(getByRole('link')).toBeInTheDocument()
  })
})
