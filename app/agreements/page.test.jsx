import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('AgreementsPage tests', () => {
  it('renders the main page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Agreements list' }))
      .toBeInTheDocument()

    /* Uncomment and test when agreements page is complete
    await expect
      .element(getByRole('table'))
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Reference'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Year'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Agreement Name'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Type'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Start Date'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'End Date'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Status'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByLabelText('Search'))
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'textbox' )) // Search box
      .toBeInTheDocument()

    // TODO
    // And each Agreements table has an option to view the record

    */
  })

  it('renders the sub-page component with content', async () => {
    const { getByRole } = await render(<Page />)
    /* Unclear how this sub-page will be implemented
       Uncomment and test when authenticate page is complete

      @basic @possible-vi-test
      Scenario: Agreement Details page opens with correct components displayed.
        Given I have gone to the Agreements page
        When I click the 'View' link next to an agreement
        Then I see a header with 'Agreement Name' as the title
        And I see underneath the header the following fields 'Agreement Ref., Type, Scheme Year, Status, Start Date, End Date'
        And I see an 'payment schedules' table with column headers as follows 'Sheet, Parcel, Description, Action Area (ha), Action Length (m), Action Units, Parcel Area (ha), Payment Schedule, Commitment Term'
        And I see an option to go back to see the main screen with Agreements table
    */
  })
})
