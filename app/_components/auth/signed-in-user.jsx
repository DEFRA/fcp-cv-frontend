'use client'

import { useIsAuthenticated, useMsal } from '@azure/msal-react'

import { useAuth } from './auth-provider'
import { cn } from '@/lib/utils'

const className = cn(
  'inline-flex items-center justify-center gap-3 rounded-lg border shadow-sm',
  'border-gray-300 bg-white px-10 py-6 text-lg font-semibold text-gray-950',
  'active:bg-gray-100 transition-colors cursor-pointer hover:bg-gray-50',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700',
  'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
)

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
        <button className={className} onClick={() => instance.logoutPopup()}>
          {accounts[0]?.username.toLowerCase()}
        </button>
      )}
    </>
  )
}
