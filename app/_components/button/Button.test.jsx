import { render } from 'vitest-browser-react'

import { Button } from './Button'

describe('Button component tests', () => {
  it('renders the button with specified text', async () => {
    const { getByText } = await render(
      <Button href="/customer">View customer</Button>
    )

    await expect.element(getByText('View customer')).toBeInTheDocument()
  })
})
