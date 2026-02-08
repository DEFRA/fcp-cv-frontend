import { render } from 'vitest-browser-react'

import packageJson from '../../../package.json' assert { type: 'json' }

import { Main } from '@/components/main/main'

describe('Main component tests', () => {
  const footerLabel = `v${packageJson.version}`

  it('renders the Main component and version footer', async () => {
    const { getByRole, getByText } = await render(
      <Main>
        <h1>Welcome to the Farm Customer Portal</h1>
        <div>Page contents...</div>
      </Main>
    )

    // explicit children
    const h1 = getByRole('heading')
    await expect.element(h1).toBeInTheDocument()
    await expect
      .element(h1)
      .toHaveTextContent('Welcome to the Farm Customer Portal')

    await expect.element(getByText('Page contents...')).toBeInTheDocument()

    // implicit footer
    await expect.element(getByText(footerLabel)).toBeInTheDocument()
  })
})
