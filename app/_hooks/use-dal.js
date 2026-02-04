import { useMsal } from '@azure/msal-react'
import useSWR from 'swr'

import { useAuth } from '@/components/auth/auth-provider'

async function dalFetcher(url, headers = {}) {
  const response = await fetch(`/api/dal/${url}`, { headers })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export function useDal(urlParts) {
  const { instance, accounts, inProgress } = useMsal()
  const { isDisabled } = useAuth()

  const key =
    urlParts.every(Boolean) && (isDisabled || accounts.length > 0)
      ? urlParts.join('/')
      : null

  const fetcher = isDisabled
    ? dalFetcher
    : async (url) => {
        const { idToken } = await instance.acquireTokenSilent({
          account: accounts[0]
        })

        return dalFetcher(url, { Authorization: `Bearer ${idToken}` })
      }

  const swr = useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false
  })

  return {
    ...swr,
    isLoading: inProgress !== 'none' || swr.isLoading
  }
}
