import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('AuthenticatePage tests', () => {
  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Memorable questions' }))
      .toBeInTheDocument()

    /* Uncomment and test when authenticate page is complete
    await expect
      .element(getByRole('table')
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Memorable Date'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Memorable Event'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Memorable Place'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Updated Date'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByText('Retrieved At' })
      .toBeInTheDocument()

    await expect
      .element(getByRole('table')
    */
  })
})
