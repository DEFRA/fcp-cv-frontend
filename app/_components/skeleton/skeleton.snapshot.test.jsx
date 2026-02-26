import { renderToString } from 'react-dom/server'

import { Skeleton } from '@/components/skeleton/skeleton'

describe('Skeleton snapshot', () => {
  test('renders skeleton if loading', () => {
    const html = renderToString(<Skeleton loading>Content</Skeleton>)
    expect(html).toMatchSnapshot()
  })

  test('renders content if not loading', () => {
    const html = renderToString(<Skeleton>Content</Skeleton>)
    expect(html).toMatchSnapshot()
  })
})
