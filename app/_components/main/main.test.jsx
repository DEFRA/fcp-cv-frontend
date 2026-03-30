import { render } from 'vitest-browser-react'
import packageJson from '../../../package.json' assert { type: 'json' }

import { Main } from '@/components/main/main'
import AppLink from '../link/AppLink'

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

  it('allows keyboard to focus on child elements in order', async () => {
    const { getByRole, getByText } = await render(
      <Main>
        <button type="submit">Submit</button>
        <div>
          <AppLink text="First link" />
        </div>
        <div>
          <AppLink text="Second link" />
        </div>
      </Main>
    )

    /* TODDO - Focus on elements does not work here
    // Required @testing-library/user-event for the code below anyway
    // Get the focus on the button
    await getByRole('button').click()

    await user.tab()
    await expect(getByText('First link')).toHaveFocus()
    */
  })
})
