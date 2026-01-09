import { renderToString } from 'react-dom/server'

import { KeyValueList } from '@/components/key-value-list/KeyValueList'

describe('KeyValueList snapshot', () => {
  it('matches the rendered structure', () => {
    const items = {
      'Total Number of Parcels:': 10,
      'Total Area (ha):': 583.03,
      'Total Parcels With Pending Customer Notified Land Changes:': 0
    }

    const html = renderToString(
      <KeyValueList title="Land Summary" items={items} />
    )

    expect(html).toMatchSnapshot()
  })
})
