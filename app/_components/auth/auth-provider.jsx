'use client'

import { EnsureSignIn } from '@/components/auth/ensure-sign-in.jsx'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { createContext, useContext, useEffect, useState } from 'react'

const context = createContext({ isDisabled: false, authenticationRequest: {} })

export function AuthProvider({ children, config }) {
  // PublicClientApplication must be created in useEffect, not useState, to avoid instantiating it during
  // SSR. On dynamic pages the server would otherwise render this client component on every request, so
  // calling new PublicClientApplication() in useState would initialise a 27KB browser-only
  // object for every request, retaining ~59KB of heap per request.
  const [instance, setInstance] = useState(null)

  useEffect(() => {
    if (!config.disabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInstance(
        new PublicClientApplication({
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
    }
  }, [config.disabled, config.clientId, config.authority, config.redirectUri])

  return (
    <context.Provider
      value={{
        isDisabled: config.disabled,
        authenticationRequest: { scopes: [config.scope] }
      }}
    >
      {config.disabled || !instance ? (
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
