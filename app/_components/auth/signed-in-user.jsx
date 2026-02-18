'use client'

import { useIsAuthenticated, useMsal } from '@azure/msal-react'

import { useAuth } from './auth-provider'

export function SignedInUser() {
  const isAuthenticated = useIsAuthenticated()
  const { instance, accounts } = useMsal()
  const { isDisabled } = useAuth()

  if (isDisabled) {
    return <>User authentication disabled</>
  }

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
