import { render } from 'vitest-browser-react'

import { KeyValueList } from '@/components/key-value-list/KeyValueList'

describe('KeyValueList component tests', () => {
  it('renders the KeyValueList with specified items', async () => {
    const items = {
      'Business type:': 'Small holding',
      'Business contact:': <a href="callto:01235 567 890">01235 567 890</a>,
      'Total Number of Parcels:': 10,
      'Total Area (ha):': 583.03,
      'Total Parcels With Pending Customer Notified Land Changes:': 0
    }

    const { getByRole, getByText } = await render(
      <KeyValueList title="Land Summary" items={items} />
    )

    const heading = getByRole('heading')
    await expect.element(heading).toBeInTheDocument()
    await expect.element(heading).toHaveTextContent('Land Summary')

    await expect.element(getByText('Business type:')).toBeInTheDocument()
    await expect.element(getByText('Small holding')).toBeInTheDocument()

    await expect.element(getByText('Business contact:')).toBeInTheDocument()
    await expect.element(getByText('01235 567 890')).toBeInTheDocument()

    await expect
      .element(getByText('Total Number of Parcels:'))
      .toBeInTheDocument()
    await expect.element(getByText('10')).toBeInTheDocument()

    await expect.element(getByText('Total Area (ha):')).toBeInTheDocument()
    await expect.element(getByText('583.03')).toBeInTheDocument()

    await expect
      .element(
        getByText('Total Parcels With Pending Customer Notified Land Changes:')
      )
      .toBeInTheDocument()
    // NOTE: use exact regex to avoid matching 0s in other fields!..
    await expect.element(getByText(/^0$/)).toBeInTheDocument()
  })
})
