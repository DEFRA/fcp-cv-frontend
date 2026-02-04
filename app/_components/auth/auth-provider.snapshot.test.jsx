import * as msalReact from '@azure/msal-react'
import { renderToString } from 'react-dom/server'

import { AuthProvider } from './auth-provider'

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

describe('AuthProvider + SignInDialog snapshot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders children without dialog when no auth error', () => {
    vi.mocked(msalReact.useMsalAuthentication).mockReturnValue({
      login: vi.fn(),
      error: null,
      result: null
    })

    const html = renderToString(
      <AuthProvider
        config={{
          clientId: 'test-client-id',
          authority: 'https://login.microsoftonline.com/test-tenant',
          redirectUri: 'http://localhost:3000'
        }}
      >
        <div data-testid="child">Hello World — protected content</div>
      </AuthProvider>
    )

    expect(html).toMatchSnapshot()
  })

  test('shows error dialog + sign-in button when silent auth fails', () => {
    vi.mocked(msalReact.useMsalAuthentication).mockReturnValue({
      login: vi.fn(),
      error: new Error('silent login failed - AADSTS50105 or similar'),
      result: null
    })

    const html = renderToString(
      <AuthProvider
        config={{
          clientId: 'test-client-id',
          authority: 'https://login.microsoftonline.com/test-tenant',
          redirectUri: 'http://localhost:3000'
        }}
      >
        <div data-testid="child">Hello World — protected content</div>
      </AuthProvider>
    )

    expect(html).toMatchSnapshot()
  })

  test('dialog stays closed when error is cleared / falsy', () => {
    vi.mocked(msalReact.useMsalAuthentication).mockReturnValue({
      login: vi.fn(),
      error: null,
      result: null
    })

    const html = renderToString(
      <AuthProvider
        config={{
          clientId: 'test-client-id',
          authority: 'https://login.microsoftonline.com/test-tenant',
          redirectUri: 'http://localhost:3000'
        }}
      >
        <p>Some content</p>
      </AuthProvider>
    )

    expect(html).toMatchSnapshot()
  })
})
