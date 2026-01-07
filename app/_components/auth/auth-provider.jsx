'use client'

import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'

const pca = new PublicClientApplication({
  auth: {
    clientId: 'bfb6fb5c-9ec6-44f9-91d6-77378e41daa7',
    authority:
      'https://login.microsoftonline.com/6f504113-6b64-43f2-ade9-242e05780007/v2.0',
    redirectUri: 'http://localhost:3000'
  },
  cache: {
    cacheLocation: 'localStorage'
  }
})

export function AuthProvider({ children }) {
  return <MsalProvider instance={pca}>{children}</MsalProvider>
}
