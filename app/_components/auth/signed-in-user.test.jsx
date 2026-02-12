import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { render } from 'vitest-browser-react'

import { SignedInUser } from '@/components/auth/signed-in-user'

let isDisabled = false
describe('SignedInUser component tests', () => {
  beforeAll(() => {
    vi.mock('@azure/msal-react', () => ({
      MsalProvider: ({ children }) => <>{children}</>,
      useIsAuthenticated: vi.fn(),
      useMsal: vi.fn(),
      useMsalAuthentication: vi.fn()
    }))
    vi.mock('@/components/auth/auth-provider', () => ({
      useAuth: vi.fn(() => ({ isDisabled }))
    }))
  })

  it('renders nothing when user is not authenticated', async () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(false)
    vi.mocked(useMsal).mockReturnValue({
      instance: { logoutPopup: vi.fn() },
      accounts: []
    })

    await render(<SignedInUser />)
  })

  it('renders lowercase username button when authenticated', async () => {
    const logoutPopup = vi.fn()
    vi.mocked(useIsAuthenticated).mockReturnValue(true)
    vi.mocked(useMsal).mockReturnValue({
      instance: { logoutPopup },
      accounts: [{ username: 'john.Smith@Email.com' }]
    })

    const { getByRole } = await render(<SignedInUser />)

    const logoutButton = getByRole('button', { name: 'john.smith@email.com' })
    await expect.element(logoutButton).toBeInTheDocument()
    await logoutButton.click()
    expect(logoutPopup).toHaveBeenCalled()
  })

  it('renders nothing when authenticated but no accounts exist', async () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(true)
    vi.mocked(useMsal).mockReturnValue({
      instance: { logoutPopup: vi.fn() },
      accounts: []
    })

    await render(<SignedInUser />)
  })

  it('renders a message advising authentication is disabled', async () => {
    vi.mocked(useMsal).mockReturnValue({})
    isDisabled = true
    const { getByText } = await render(<SignedInUser />)

    await expect
      .element(getByText('User authentication disabled'))
      .toBeInTheDocument()
  })
})
