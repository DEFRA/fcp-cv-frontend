'use client'

import { cn } from '@/lib/utils'
import { InteractionType } from '@azure/msal-browser'
import { useMsalAuthentication } from '@azure/msal-react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'

const request = {
  scopes: ['User.Read']
}
const className = cn(
  'rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white ',
  'shadow-xs hover:bg-green-500 focus-visible:outline-2 dark:bg-green-500 ',
  'focus-visible:outline-offset-2 focus-visible:outline-green-600 ',
  'dark:hover:bg-green-400 dark:focus-visible:outline-green-500'
)

export function EnsureSignIn({ children }) {
  const { login, error } = useMsalAuthentication(
    InteractionType.Silent,
    request
  )

  return (
    <>
      <Dialog open={!!error} onClose={() => {}} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-xs" />

        <div className="fixed inset-0">
          <DialogPanel className="mx-auto max-w-lg space-y-4 bg-white p-7 rounded-2xl mt-10">
            <DialogTitle>
              Sign in to your DEFRA account to use Consolidated View.
            </DialogTitle>

            <button
              onClick={() => login(InteractionType.Popup, request)}
              className={className}
            >
              Sign in
            </button>
          </DialogPanel>
        </div>
      </Dialog>
      {children}
    </>
  )
}
