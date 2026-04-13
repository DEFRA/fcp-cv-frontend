import { render } from 'vitest-browser-react'

import { ButtonLink } from './ButtonLink'

describe('ButtonLink component tests', () => {
  it('renders with specified text', async () => {
    const { getByText } = await render(<ButtonLink>Click here</ButtonLink>)

    await expect.element(getByText('Click here')).toBeInTheDocument()
  })

  it('renders as a button element', async () => {
    const { getByRole } = await render(<ButtonLink>Click here</ButtonLink>)

    await expect.element(getByRole('button')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const { getByRole } = await render(
      <ButtonLink onClick={onClick}>Click here</ButtonLink>
    )

    await getByRole('button').click()

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies additional className alongside default styles', async () => {
    const { getByRole } = await render(
      <ButtonLink className="mb-2">Click here</ButtonLink>
    )

    await expect.element(getByRole('button')).toHaveClass('mb-2')
    await expect.element(getByRole('button')).toHaveClass('underline')
  })
})
