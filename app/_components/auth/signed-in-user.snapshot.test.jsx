import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { renderToString } from 'react-dom/server'

import { SignedInUser } from './signed-in-user'

// Hoisted mock — Vitest runs this before any imports
vi.mock('@azure/msal-react', () => {
  return {
    useIsAuthenticated: vi.fn(),
    useMsal: vi.fn()
  }
})

describe('SignedInUser snapshot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders nothing when user is not authenticated', () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(false)
    vi.mocked(useMsal).mockReturnValue({
      instance: { logoutPopup: vi.fn() },
      accounts: []
    })

    const html = renderToString(<SignedInUser />)
    expect(html).toMatchSnapshot()
  })

  test('renders lowercase username button when authenticated', () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(true)
    vi.mocked(useMsal).mockReturnValue({
      instance: { logoutPopup: vi.fn() },
      accounts: [{ username: 'john.Smith@Email.com' }]
    })

    const html = renderToString(<SignedInUser />)
    expect(html).toMatchSnapshot()
  })

  test('renders nothing when authenticated but no accounts exist', () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(true)
    vi.mocked(useMsal).mockReturnValue({
      instance: { logoutPopup: vi.fn() },
      accounts: []
    })

    const html = renderToString(<SignedInUser />)
    expect(html).toMatchSnapshot()
  })
})
