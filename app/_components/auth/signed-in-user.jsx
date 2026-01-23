'use client'

import { useIsAuthenticated, useMsal } from '@azure/msal-react'

export function SignedInUser() {
  const isAuthenticated = useIsAuthenticated()
  const { instance, accounts } = useMsal()

  return (
    <>
      {isAuthenticated && (
        <button onClick={() => instance.logoutPopup()}>
          {accounts[0]?.username.toLowerCase()}
        </button>
      )}
    </>
  )
}
