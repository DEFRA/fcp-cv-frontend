import { useMsal } from '@azure/msal-react'
import useSWR from 'swr'

import { useAuth } from '@/components/auth/auth-provider'

/**
 * Example of how to use MSAL token when making requests,
 * will need extending to accept params etc
 *
 * idToken contains the user's email, can be verified server-side
 * It is safe to acquireTokenSilent is called on every request
 *
 * useSWR nicely handles waiting to complete the request until the token is available
 * if the url is `null` it waits for the url to change before running the request
 */
export function useData(url) {
  const { instance, accounts, inProgress } = useMsal()
  const { isDisabled } = useAuth()

  const key = url && (isDisabled || accounts.length > 0) ? url : null

  const fetcher = async (resource) => {
    let headers = {}

    if (!isDisabled) {
      const { idToken } = await instance.acquireTokenSilent({
        scopes: [],
        account: accounts[0]
      })

      headers = { Authorization: `Bearer ${idToken}` }
    }

    const res = await fetch(resource, { headers })

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    }

    return res.json()
  }

  const swr = useSWR(key, fetcher)

  return {
    ...swr,
    isLoading: inProgress !== 'none' || swr.isLoading
  }
}
