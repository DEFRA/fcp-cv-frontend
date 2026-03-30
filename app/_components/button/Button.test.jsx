import { render } from 'vitest-browser-react'
import { screen, fireEvent } from '@testing-library/react'

import { Button, LinkButton } from './Button'

describe('Button component tests', () => {
  it('renders with specified text', async () => {
    const { getByText } = await render(<Button>View customer</Button>)
    await expect.element(getByText('View customer')).toBeInTheDocument()
  })

  it('fires onclick when enabled and clicked on', async () => {
    const handleClick = vi.fn()
    const { getByText } = await render(
      <Button onClick={handleClick}>View customer</Button>
    )

    const vc = await getByText('View customer')
    await vc.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onclick when disabled and clicked on', async () => {
    const handleClick = vi.fn()
    const { getByText } = await render(
      <Button onClick={handleClick} disabled>
        View customer
      </Button>
    )

    await fireEvent.click(screen.getByText('View customer'))
    await expect(handleClick).toHaveBeenCalledTimes(0)
  })

  it('is disabled when disabled property is set', async () => {
    const { getByRole } = await render(<Button disabled>View customer</Button>)
    await expect.element(getByRole('button')).toBeDisabled()
  })
})

describe('ExternalLinkButton component tests', () => {
  it('renders with specified text', async () => {
    const { getByText } = await render(
      <LinkButton href="/customer">View customer</LinkButton>
    )
    await expect.element(getByText('View customer')).toBeInTheDocument()
  })

  it('applies href and target attributes when provided', async () => {
    const { getByRole } = await render(
      <LinkButton href="/customer" target="_blank">
        View customer
      </LinkButton>
    )

    await expect.element(getByRole('link')).toHaveAttribute('target', '_blank')
    await expect.element(getByRole('link')).toHaveAttribute('href', '/customer')
  })

  it('should render a button as a Link and checks for href attribute', async () => {
    const { getByRole } = await render(
      <LinkButton href="/customer">View customer</LinkButton>
    )
    await expect.element(getByRole('link')).toHaveAttribute('href', '/customer')
  })
})
