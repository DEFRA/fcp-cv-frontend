import { render } from 'vitest-browser-react'

import { Button, LinkButton } from './Button'

describe('Button component tests', () => {
  it('renders the button with specified text', async () => {
    const { getByText } = await render(<Button>View customer</Button>)

    await expect.element(getByText('View customer')).toBeInTheDocument()
  })

  it('renders the link button with specified text', async () => {
    const { getByText } = await render(
      <LinkButton href="/customer">View customer</LinkButton>
    )
    await expect.element(getByText('View customer')).toBeInTheDocument()
  })
})
