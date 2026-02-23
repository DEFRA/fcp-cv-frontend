import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('ApplicationsPage tests', () => {
  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Applications list' }))
      .toBeInTheDocument()

    /* Uncomment and test when applications page is complete

    await expect
      .element(getByRole('table')) // Needs to be refactored as we have multiple tables on this screen ('Applications list' table)
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Application ID'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Year'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Application Name'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Status'})) // Table header is a th/button/span
      .toBeInTheDocument()

    // TODO
    // And the first item of the 'Applications' table is selected

    await expect
      .element(getByLabelText('Search'))
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'textbox' )) // Search box
      .toBeInTheDocument()

    // TODO
    // And there is an Application Details pane on the right-hand pane

    const selectedApplicationName = 'My name' // Need to seed some data and add this
    await expect
      .element(getByRole( 'heading', { name: selectedApplicationName })) // This text selector is data-reliant, brittle?
      .toHaveClass(/font-bold/)

    await expect
      .element(getByText( 'Application ID' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText( 'Scheme' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText( 'Year' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText( 'Status' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText( 'Status (Portal)' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText( 'Submitted Date' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText( 'Agreement References' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText( 'Last Movement' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByText( 'Last Movement Date/Time' )) // Label
      .toBeInTheDocument()

    await expect
      .element(getByLabel( 'Application ID' )) // Value
      .not.toBeEmpty()

    await expect
      .element(getByLabel( 'Scheme' )) // Value
      .not.toBeEmpty()

    await expect
      .element(getByLabel( 'Year' )) // Value
      .not.toBeEmpty()

    await expect
      .element(getByLabel( 'Status' )) // Value
      .not.toBeEmpty()

    await expect
      .element(getByLabel( 'Status (Portal)' )) // Value
      .not.toBeEmpty()

    await expect
      .element(getByLabel( 'Submitted Date' )) // Value
      .not.toBeEmpty()

    await expect
      .element(getByLabel( 'Agreement References' )) // Value
      .not.toBeEmpty()

    await expect
      .element(getByLabel( 'Last Movement' )) // Value
      .not.toBeEmpty()

    await expect
      .element(getByLabel( 'Last Movement Date/Time' )) // Value
      .not.toBeEmpty()

    // TODO
    // And the Application Details pane has a Movement History section

    await expect
      .element(getByRole('table')) // Needs to be refactored as we have multiple tables on this screen ('Movements History' table)
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Date/Time'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Movement'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Check'})) // Table header is a th/button/span
      .toBeInTheDocument()

    */
  })
})
