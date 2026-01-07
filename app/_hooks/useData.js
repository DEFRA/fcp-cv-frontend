import { useMsal } from '@azure/msal-react'
import useSWR from 'swr'

export function useData(url) {
  const { instance, accounts, inProgress } = useMsal()

  const response = useSWR(!!accounts.length ? url : null, async () => {
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
