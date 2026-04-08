import { render } from 'vitest-browser-react'

import { Button } from './Button'

describe('Button component tests', () => {
  it('renders the button with specified text', async () => {
    const { getByText } = await render(<Button>View customer</Button>)

    await expect.element(getByText('View customer')).toBeInTheDocument()
  })

  it('shows loading text when loading', async () => {
    const { getByText } = await render(<Button loading>View customer</Button>)

    await expect.element(getByText('Loading…')).toBeInTheDocument()
  })

  it('is disabled when loading', async () => {
    const { getByText } = await render(<Button loading>View customer</Button>)

    await expect.element(getByText('Loading…')).toBeDisabled()
  })

  it('shows children when not loading', async () => {
    const { getByText } = await render(<Button>View customer</Button>)

    await expect.element(getByText('View customer')).not.toBeDisabled()
  })
})
