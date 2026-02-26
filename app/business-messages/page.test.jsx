import { render } from 'vitest-browser-react'

import Page from './page.jsx'

describe('BusinessMessagesPage tests', () => {
  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Business messages' }))
      .toBeInTheDocument()

    /* Uncomment and test when message page is complete
    await expect
      .element(getByLabel('Choose a contact...')) // Contact
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Last 12 months')) // Date Range
      .toBeDisabled()

    await expect
      .element(getByLabelText('All')) // Show Read/Unread
      .toBeInTheDocument()

    await expect
      .element(getByLabelText('Search'))
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'textbox' )) // Search box
      .toBeInTheDocument()
    */
  })

  it('Page updates correctly once a contact is selected', async () => {
    const { getByRole, getByLabel, getByLabelText } = await render(<Page />)

    /* Uncomment and test when message page is complete
    await getByLabel('Choose a contact...').selectOption({ index: 1 }) // Select the 2nd option in the list (the first contact as the 1st item is the 'choose a contact' text)

    await expect
      .element(getByLabel('Last 12 months')) // Date Range
      .toBeEnabled()

    await expect
      .element(getByLabelText('All')) // Show Read/Unread
      .toBeEnabled()

    await expect
      .element(getByLabel('Last 12 months')) // Date Range
      .toHaveText(['Last 12 months', 'Last 24 months', 'Last 36 months', 'All']);

    await expect
      .element(getByLabelText('All')) // Show Read/Unread
      .toHaveText(['All', 'Read', 'Unread']);

    await expect
      .element(getByRole('table')) // Messages table
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Status'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Date'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Subject'})) // Table header is a th/button/span
      .toBeInTheDocument()

    // TODO
    // And the first item of the 'Messages' table is selected
    */
  })
})
