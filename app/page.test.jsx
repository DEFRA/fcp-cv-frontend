import { render } from 'vitest-browser-react'

import CVPage from './page.jsx'

describe('CVPage tests', () => {
  it('renders the page component with content and links to the CV apps', async () => {
    const { getByRole } = await render(
      await CVPage({
        searchParams: Promise.resolve()
      })
    )

    await expect
      .element(getByRole('heading', { name: 'Consolidated View' }))
      .toBeInTheDocument()
    await expect(getByRole('link').length).toBe(9)
  })
})
