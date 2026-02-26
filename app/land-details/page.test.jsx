import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('LandDetailsPage tests', () => {
  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Land details' }))
      .toBeInTheDocument()

    /* Uncomment and test when land details page is complete
    await expect
      .element(getByText('Date')) // Date label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Date')) // Date filter
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'heading', { name: 'Land Summary' }))
      .toHaveClass(/font-bold/)

    await expect
      .element(getByRole('heading', { name: 'Land details' }))
      .toBeInTheDocument()

    await expect
      .element(getByText('Total Number of Parcels')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Total Number of Parcels')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Total Area (ha)')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Total Area (ha)')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Total Parcels with Pending Customer Notified Land Changes')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Total Parcels with Pending Customer Notified Land Changes')) // value
      .not.toBeEmpty()

    await expect
      .element(getByRole('table')) // 'Land Summary' table, Needs to be refactored as there are more than one table on this page
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Code'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Land Cover'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Area (ha)'})) // Table header is a th/button/span
      .toBeInTheDocument()

    // TODO
    // And I see a Parcels pane

    await expect
      .element(getByRole('table')) // 'Parcels' table, Needs to be refactored as there are more than one table on this page
      .toBeInTheDocument()

    await expect
      .element(getByText('Search')) // Search label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Search')) // Search box
      .toBeEmpty()

    await expect
      .element(getByRole('button', { name: 'Sheet'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Parcel'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Area (ha)'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Land Change?'})) // Table header is a th/button/span
      .toBeInTheDocument()
    */
  })

  it('renders the parcel summary section correctly', async () => {
    const { getByRole } = await render(<Page />)

    /* Uncomment and test when land details page is complete
    await getByRole('table'). // 'Parcels' table, Needs to be refactored as there are more than one table on this page
      .getByRole('row')
      .nth(1) // Get the first data row
      .click()

    const selectedParcelSheetAndCode = 'AAA BBB' // Need to seed some data and add this - concatenation of the sheet and parcel codes selected
    await expect
      .element(getByRole( 'heading', { name: selectedParcelSheetAndCode })) // This text selector is data-reliant, brittle?
      .toHaveClass(/font-bold/)

    await expect
      .element(getByText('Area (ha)')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Area (ha)')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Pending Customer Notified Land Change?')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Pending Customer Notified Land Change?')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Effective Date From')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Effective Date From')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Effective Date To')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Effective Date To')) // value
      .not.toBeEmpty()

    await expect
      .element(getByRole('table')) // 'Parcel summary' table, Needs to be refactored as there are more than one table on this page
      .toBeInTheDocument()

     await expect
       .element(getByRole('button', { name: 'Code'})) // Table header is a th/button/span
       .toBeInTheDocument()

     await expect
       .element(getByRole('button', { name: 'Land Cover'})) // Table header is a th/button/span
       .toBeInTheDocument()

     await expect
       .element(getByRole('button', { name: 'Area (ha)'})) // Table header is a th/button/span
       .toBeInTheDocument()
    */
  })
})
