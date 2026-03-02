import { render } from 'vitest-browser-react'

import { Skeleton } from '@/components/skeleton/skeleton'

describe('Skeleton component tests', () => {
  it('renders the children when not loading', async () => {
    const { getByText } = await render(<Skeleton>Text</Skeleton>)

    await expect.element(getByText('Text')).toBeInTheDocument()
  })

  it('renders the skeleton when loading', async () => {
    const { getByText } = await render(<Skeleton loading>Text</Skeleton>)

    await expect.element(getByText('View customer')).not.toBeInTheDocument()
  })
})
