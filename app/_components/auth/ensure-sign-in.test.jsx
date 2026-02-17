import { vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { EnsureSignIn } from '@/components/auth/ensure-sign-in'

const login = vi.fn()
const msalSession = { login, error: 'not-logged-in' }

describe('EnsureSignIn component tests', () => {
  beforeAll(() => {
    vi.mock('@azure/msal-react', () => ({
      useMsalAuthentication: () => msalSession
    }))
  })

  it('renders the EnsureSignIn component with children', async () => {
    const { getByRole, getByText } = await render(
      <EnsureSignIn>
        <div>Test child content</div>
      </EnsureSignIn>
    )

    await expect.element(getByText('Test child content')).toBeInTheDocument()
    await expect
      .element(
        getByText('Sign in to your DEFRA account to use Consolidated View.')
      )
      .toBeVisible()

    const signInButton = getByRole('button', { name: 'Sign in' })
    await expect.element(signInButton).toBeVisible()
    await signInButton.click()
    expect(login).toHaveBeenCalledWith('popup', {
      scopes: ['User.Read']
    })
    await expect.element(getByRole('dialog')).not.toBeVisible()
  })
})
