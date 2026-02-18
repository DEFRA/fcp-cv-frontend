import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('LandDetailsPage tests', () => {
  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Land details' }))
      .toBeInTheDocument()
  })
})
