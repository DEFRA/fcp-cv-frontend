'use client'

import { EnsureSignIn } from '@/components/auth/ensure-sign-in.jsx'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { createContext, useContext, useState } from 'react'

const context = createContext({ isDisabled: false })

export function AuthProvider({ children, config }) {
  const [instance] = useState(() =>
    config.disabled
      ? null
      : new PublicClientApplication({
          auth: {
            clientId: config.clientId,
            authority: config.authority,
            redirectUri: config.redirectUri
          },
          cache: {
            cacheLocation: 'localStorage'
          }
        })
  )

  return (
    <context.Provider value={{ isDisabled: config.disabled }}>
      {config.disabled ? (
        <>{children}</>
      ) : (
        <MsalProvider instance={instance}>
          <EnsureSignIn>{children}</EnsureSignIn>
        </MsalProvider>
      )}
    </context.Provider>
  )
}

export function useAuth() {
  return useContext(context)
}
