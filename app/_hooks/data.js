import { useMsal } from '@azure/msal-react'
import useSWR from 'swr'

import { useAuth } from '@/components/auth/auth-provider'

async function fetcher(url, headers = {}) {
  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

function useData(urlParts, runWhenTruthy) {
  const { instance, accounts, inProgress } = useMsal()
  const { isDisabled, authenticationRequest } = useAuth()

  const key =
    urlParts.every(Boolean) &&
    runWhenTruthy.every(Boolean) &&
    (isDisabled || accounts.length > 0)
      ? urlParts.join('/')
      : null

  const swr = useSWR(
    key,
    isDisabled
      ? fetcher
      : async (url) => {
          const { accessToken, idToken } = await instance.acquireTokenSilent({
            ...authenticationRequest,
            account: accounts[0]
          })

          return fetcher(url, {
            'x-msal-access-token': accessToken,
            'x-msal-id-token': idToken
          })
        },
    {
      onError: (error) => {
        console.error('Data fetching error:', error)
      },
      onSuccess: (data) => {
        console.debug('Data fetched successfully:', data)
      },
      revalidateIfStale: false,
      revalidateOnFocus: false
    }
  )

  return {
    ...swr,
    isLoading: inProgress !== 'none' || swr.isLoading
  }
}

export function useDal(urlParts = [], runWhenTruthy = []) {
  return useData(['/api/dal', ...urlParts], runWhenTruthy)
}

export function useDataverse(urlParts = [], runWhenTruthy = []) {
  return useData(['/api/dataverse', ...urlParts], runWhenTruthy)
}
