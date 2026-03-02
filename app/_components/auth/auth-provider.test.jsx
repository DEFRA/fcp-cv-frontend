import * as msalReact from '@azure/msal-react'
import { vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { AuthProvider } from '@/components/auth/auth-provider'

describe('AuthProvider component tests', () => {
  beforeAll(() => {
    vi.mock('@azure/msal-browser', async (importOriginal) => {
      const actual = await importOriginal()

      return {
        ...actual,
        PublicClientApplication: class {
          initialize = vi.fn().mockResolvedValue(undefined)
          getAllAccounts = vi.fn().mockReturnValue([])
        }
      }
    })
    vi.mock('@azure/msal-react', async () => {
      const actual = await vi.importActual('@azure/msal-react')
      return {
        ...actual,
        MsalProvider: ({ children }) => <>{children}</>,
        useMsalAuthentication: vi.fn()
      }
    })
  })
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children without dialog when no auth error', async () => {
    vi.mocked(msalReact.useMsalAuthentication).mockReturnValue({
      login: vi.fn(),
      error: null,
      result: null
    })

    const { getByText } = await render(
      <AuthProvider
        config={{
          authority: 'https://login.microsoftonline.com/test-tenant',
          redirectUri: 'http://localhost:3000',
          scope: 'test-scope'
        }}
      >
        <div>Test child content</div>
      </AuthProvider>
    )

    await expect.element(getByText('Test child content')).toBeInTheDocument()
    await expect
      .element(
        getByText('Sign in to your DEFRA account to use Consolidated View.')
      )
      .not.toBeInTheDocument()
  })

  it('shows error dialog + sign-in button when silent auth fails', async () => {
    vi.mocked(msalReact.useMsalAuthentication).mockReturnValue({
      login: vi.fn(),
      error: new Error('silent login failed - AADSTS50105 or similar'),
      result: null
    })

    const { getByRole, getByText } = await render(
      <AuthProvider
        config={{
          authority: 'https://login.microsoftonline.com/test-tenant',
          redirectUri: 'http://localhost:3000',
          scope: 'test-scope'
        }}
      >
        <div data-testid="child">Hello World — protected content</div>
      </AuthProvider>
    )

    await expect
      .element(
        getByRole('heading', {
          name: 'Sign in to your DEFRA account to use Consolidated View.'
        })
      )
      .toBeVisible()
    const signInButton = getByRole('button', { name: 'Sign in' })
    await expect.element(signInButton).toBeVisible()
    await signInButton.click()
    expect(msalReact.useMsalAuthentication().login).toHaveBeenCalledWith(
      'popup',
      {
        scopes: ['test-scope']
      }
    )
  })

  it('dialog stays closed when error is cleared / falsy', async () => {
    vi.mocked(msalReact.useMsalAuthentication).mockReturnValue({
      login: vi.fn(),
      error: null,
      result: null
    })

    const { getByText } = await render(
      <AuthProvider
        config={{
          authority: 'https://login.microsoftonline.com/test-tenant',
          redirectUri: 'http://localhost:3000',
          scope: 'test-scope'
        }}
      >
        <p>Some content</p>
      </AuthProvider>
    )

    await expect.element(getByText('Some content')).toBeInTheDocument()
  })
})
