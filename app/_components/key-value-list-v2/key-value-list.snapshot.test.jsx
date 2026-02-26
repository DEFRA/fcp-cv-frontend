import { renderToString } from 'react-dom/server'

import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'

describe('KeyValueList snapshot', () => {
  test('shows skeleton if loading', () => {
    const loading = true

    const html = renderToString(
      <KeyValueList>
        <KeyValueListTitle loading={loading}>Title</KeyValueListTitle>
        <KeyValueListContent>
          {[{ dt: 'dt', dd: 'dd' }].map((item) => (
            <KeyValueListItem loading={loading} key={item.dt} {...item} />
          ))}
        </KeyValueListContent>
      </KeyValueList>
    )

    expect(html).toMatchSnapshot()
  })

  test('shows content if not loading', () => {
    const loading = false

    const html = renderToString(
      <KeyValueList>
        <KeyValueListTitle loading={loading}>Title</KeyValueListTitle>
        <KeyValueListContent>
          {[{ dt: 'dt', dd: 'dd' }].map((item) => (
            <KeyValueListItem loading={loading} key={item.dt} {...item} />
          ))}
        </KeyValueListContent>
      </KeyValueList>
    )

    expect(html).toMatchSnapshot()
  })

  test('shows content if not loading with expand', () => {
    const loading = false

    const html = renderToString(
      <KeyValueList>
        <KeyValueListTitle loading={loading}>Title</KeyValueListTitle>
        <KeyValueListContent>
          {[{ dt: 'dt', dd: 'dd', expand: 'expand' }].map((item) => (
            <KeyValueListItem loading={loading} key={item.dt} {...item} />
          ))}
        </KeyValueListContent>
      </KeyValueList>
    )

    expect(html).toMatchSnapshot()
  })
})
