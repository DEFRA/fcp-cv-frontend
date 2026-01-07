'use client'

import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle
} from '@/components/auth/dialog.jsx'
import { InteractionType } from '@azure/msal-browser'
import { useMsalAuthentication } from '@azure/msal-react'
import { Button } from '@headlessui/react'

const request = {
  scopes: ['User.Read']
}

export function Login() {
  const { login, error } = useMsalAuthentication(
    InteractionType.Silent,
    request
  )

  return (
    <>
      <Dialog open={!!error} onClose={() => {}}>
        <DialogTitle>Sign in required</DialogTitle>
        <DialogDescription>
          To use Consolidated View, you need to sign in to your DEFRA account.
        </DialogDescription>
        <DialogActions>
          <Button
            color="green"
            onClick={() => login(InteractionType.Popup, request)}
          >
            Sign in
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
