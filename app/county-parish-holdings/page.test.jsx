import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('CountyParishHoldingsPage tests', () => {
  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'County Parish Holdings' }))
      .toBeInTheDocument()

    /* Uncomment and test when CPH page is complete
    await expect
      .element(getByRole('table')) // This will fail/report incorrectly for pages with more than one table, need a solution in those situations
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'CPH number'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Parish'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Start Date'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'End Date'})) // Table header is a th/button/span
      .toBeInTheDocument()

    // TODO
    // And the first item of the 'CPH' table is selected

    await expect
      .element(getByLabelText('Search'))
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'textbox' )) // Search box
      .toBeInTheDocument()

    // TODO
    // And I see a CPH Details pane on the right

    const selectedCph = 'My cph' // Need to seed some data and add this
    await expect
      .element(getByRole( 'heading', { name: 'CPH Number: ' + selectedCph })) // This text selector is data-reliant, brittle?
      .toHaveClass(/font-bold/)

   await expect
     .element(getByText('Parish'))
      .toBeInTheDocument()

   await expect
     .element(getByText('Start Date'))
      .toBeInTheDocument()

   await expect
     .element(getByText('End Date'))
      .toBeInTheDocument()

   await expect
     .element(getByText('Coordinates (x, y)'))
      .toBeInTheDocument()

   await expect
     .element(getByText('Species'))
      .toBeInTheDocument()

   await expect
     .element(getByText('Address'))
      .toBeInTheDocument()

   await expect
     .element(getByLabel('Parish'))
     .not.toBeEmpty()

   await expect
     .element(getByLabel('Start Date'))
     .not.toBeEmpty()

   await expect
     .element(getByLabel('End Date'))
     .not.toBeEmpty()

   await expect
     .element(getByLabel('Coordinates (x, y)'))
     .not.toBeEmpty()

   await expect
     .element(getByLabel('Species'))
     .not.toBeEmpty()

   await expect
     .element(getByLabel('Address'))
     .not.toBeEmpty()
  */
  })
})
