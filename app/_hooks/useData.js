import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import useSWR from 'swr'

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
  const isAuthenticated = useIsAuthenticated()
  const { instance, accounts, inProgress } = useMsal()

  const response = useSWR(isAuthenticated ? url : null, async () => {
    const { idToken } = await instance.acquireTokenSilent({
      account: accounts[0]
    })

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    })

    return response.json()
  })

  return {
    ...response,
    isLoading: inProgress === 'startup' || response.isLoading
  }
}
