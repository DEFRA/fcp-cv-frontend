import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('LinkedContactsPage tests', () => {
  beforeAll(() => {
    vi.mock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams()
    }))
  })

  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Linked contacts' }))
      .toBeInTheDocument()
  })
})
