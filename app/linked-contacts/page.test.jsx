import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('LinkedContactPage tests', () => {

  it('renders the page component with content', async () => {
    const { getByRole, getByText, getByLabelText } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Linked contacts' }))
      .toBeInTheDocument()

    await expect
      .element(getByRole('link', { name: 'View Authenticate Questions' }))
      .toBeInTheDocument()

    await expect
      .element(getByRole('table')) // This will fail for pages with more than one table
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'CRN'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'First Name'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Last Name'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('term').filter({ hasText: 'CRN' }))
      .toBeInTheDocument()

    await expect
      .element(getByRole('term').filter({ hasText: 'Full name:' }))
      .toBeInTheDocument()

    await expect
      .element(getByRole('term').filter({ hasText: 'Role:' }))
      .toBeInTheDocument()

    await expect
      .element(getByRole('link', { name: 'View customer' }))
      .toBeInTheDocument()

    await expect
      .element(getByLabelText('Search'))
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'textbox' )) // Search box
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'heading', { name: 'Kailey Olson' })) // This text selector is data-reliant, brittle?
      .toHaveClass(/font-bold/)

    // TODO
    // And the first item of the 'Contacts' table is selected
    // And I see an 'Permissions' table with column headers as follows 'Permission, Level' in the right-hand side pane
    // And the first item of the 'Permission' table is selected
    // And I see an 'Permission Description' table with column headers as follows 'Permission Description'
    // And the first item of the 'Permission Description' table is selected
  })
})
