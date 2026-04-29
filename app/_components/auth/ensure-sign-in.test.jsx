import { vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { EnsureSignIn } from '@/components/auth/ensure-sign-in'

const login = vi.fn()
const msalSession = { login, error: 'not-logged-in' }

describe('EnsureSignIn component tests', () => {
  beforeAll(() => {
    vi.mock('@azure/msal-react', () => ({
      MsalProvider: ({ children }) => <>{children}</>,
      useMsalAuthentication: () => msalSession
    }))
    vi.mock('@/components/auth/auth-provider', () => ({
      useAuth: () => ({
        authenticationRequest: {
          scopes: ['test-scope']
        }
      })
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
        getByText(
          "Click 'Continue' to use Consolidated View (CV). You should only need to do this once."
        )
      )
      .toBeVisible()

    const signInButton = getByRole('button', { name: 'Continue' })
    await expect.element(signInButton).toBeVisible()
    await signInButton.click()
    expect(login).toHaveBeenCalledWith('popup', {
      scopes: ['test-scope']
    })
    await expect.element(getByRole('dialog')).not.toBeVisible()
  })
})
