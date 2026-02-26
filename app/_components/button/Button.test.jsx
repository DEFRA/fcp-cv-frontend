import { render } from 'vitest-browser-react'
import { fireEvent, screen } from "@testing-library/react";

import { Button, ExternalLinkButton } from './Button'

describe('Button component tests', () => {
  it('renders with specified text', async () => {
    const { getByText } = await render(
      <Button>View customer</Button>
    )
    await expect.element(getByText('View customer')).toBeInTheDocument()
  })

  it('fires onclick when enabled and clicked on', async () => {
    const handleClick = vi.fn();
    const { getByText } = await render(
      <Button onClick={handleClick}>View customer</Button>
    )
    await fireEvent.click(await screen.getByText("View customer"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  })

  it('does not fire onclick when disabled and clicked on', async () => {
    const handleClick = vi.fn();
    const { getByText } = await render(
      <Button onClick={handleClick} disabled>View customer</Button>
    )
    await fireEvent.click(await screen.getByText("View customer"));
    await expect(handleClick).toHaveBeenCalledTimes(0);
  })

  it("is disabled when disabled property is set", async () => {
    const { getByRole } = await render(
      <Button disabled>View customer</Button>
    )
    await expect.element(screen.getByRole("button")).toBeDisabled();
  });

})

describe('ExternalLinkButton component tests', () => {

  it('renders with specified text', async () => {
    const { getByText } = await render(
      <ExternalLinkButton href="/customer">View customer</ExternalLinkButton>
    )
    await expect.element(getByText('View customer')).toBeInTheDocument()
  })

  it('applies href and target attributes when provided', async () => {
    const { getByRole } = await render(
      <Button href="/customer" target="_blank">View customer</Button>
    )

    await expect.element(getByRole("button")).toHaveAttribute("target", "_blank");
    await expect.element(getByRole("button")).toHaveAttribute("href", "/customer");
  })

  it("is disabled when disabled property is set", async () => {
    const { getByRole } = await render(
      <Button href="/customer" target="_blank" disabled>View customer</Button>
    )
    await expect.element(getByRole("button")).toBeDisabled();
  });

  it('should render a button as a Link and checks for href attribute', async () => {
    const { getByRole } = await render(
      <ExternalLinkButton href="/customer">View customer</ExternalLinkButton>
    )
    await expect.element(getByRole('link', { name: 'View customer' })).toHaveAttribute('href', '/customer')
  })

})
