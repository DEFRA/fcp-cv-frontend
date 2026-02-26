import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('LinkedBusinessesPage tests', () => {
  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Linked businesses' }))
      .toBeInTheDocument()

    /* Uncomment and test when Linked businesses page is complete
    await expect
      .element(getByLabelText('Search'))
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'textbox' )) // Search box
      .toBeInTheDocument()

    await expect
      .element(getByRole('table')) // This will fail/report incorrectly for pages with more than one table, need a solution in those situations
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'SBI'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Name'})) // Table header is a th/button/span
      .toBeInTheDocument()

    // TODO
    // And the first item of the 'Businesses' table is selected

    const selectedBusinessName = 'Business name' // Need to seed some data and add this
    await expect
      .element(getByRole( 'heading', { name: selectedBusinessName })) // This text selector is data-reliant, brittle?
      .toHaveClass(/font-bold/)

    await expect
      .element(getByText('SBI')) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText('Role')) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText('SBI')) // Value
      .not.toBeEmpty()

    await expect
      .element(getByText('Role')) // Value
      .not.toBeEmpty()

    await expect
      .element(getByRole('link', { name: 'View business' }))
      .toBeInTheDocument()

    await expect
      .element(getByRole('table')) // Permissions table (needs to be refactored, there are more than one table on this page)
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Permission'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Level'})) // Table header is a th/button/span
      .toBeInTheDocument()

    // TODO
    // And the first item of the 'permissions' table is selected

    await expect
      .element(getByRole('table')) // Permissions description table (needs to be refactored, there are more than one table on this page)
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Permission Description'})) // Table header is a th/button/span
      .toBeInTheDocument()

    // TODO
    // And the first item of the 'permissions' table is selected
    */
  })
})
