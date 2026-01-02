import { renderToString } from 'react-dom/server'

import { Main } from '@/components/main/main'

describe('Main snapshot', () => {
  it('matches the rendered structure', () => {
    const html = renderToString(<Main />)

    expect(html).toMatchSnapshot()
  })
})
