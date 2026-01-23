'use client'

import { authClient } from '@/lib/auth-client'

export function SignInButton({ email }) {
  return email ? (
    <button
      onClick={async () => {
        await authClient.signOut()
      }}
    >
      Sign Out: {email}
    </button>
  ) : (
    <button
      onClick={async () => {
        await authClient.signIn.social({
          provider: 'microsoft',
          callbackURL: '/'
        })
      }}
    >
      Sign In
    </button>
  )
}
