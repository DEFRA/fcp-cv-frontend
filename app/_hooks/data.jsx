import { useMsal } from '@azure/msal-react'
import useSWR from 'swr'

import { useAuth } from '@/components/auth/auth-provider'
import { notification } from '@/components/notification/Notifications'
import { ButtonLink } from '@/components/button-link/ButtonLink'
import { reloadPage } from '@/hooks/reload-page'

async function handleResponse(response, username) {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      const emailAddressMessage = username
        ? ` with email address <${username}>`
        : ``
      notification.error(
        `You do not have permissions to view this data. Make sure you have an active Rural Payments Portal account${emailAddressMessage}. See Consolidated View guidance for more information.`
      )
    } else if (response.status === 404) {
      notification.error('The requested resource was not found')
    } else {
      notification.error(
        <span>
          An error has occurred. Please report this if it continues to occur.{' '}
          <ButtonLink onClick={reloadPage}>Click to retry.</ButtonLink>
        </span>
      )
    }
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  } else {
    if (response.status === 206) {
      // Although the DAL request has not failed.  Some elements of the requested data have not been retrieved, due to an error
      notification.warn(
        <span>
          An error has occurred. Some data may be missing.{' '}
          <ButtonLink onClick={reloadPage}>Click to retry.</ButtonLink>
        </span>
      )
    }
  }
  return response.json()
}

async function fetcher(url, username, headers = {}) {
  let response
  try {
    response = await fetch(url, { headers })
  } catch (error) {
    notification.error(
      <span>
        An error has occurred. Please report this if it continues to occur.{' '}
        <ButtonLink onClick={reloadPage}>Click to retry.</ButtonLink>
      </span>
    )
    throw error
  }

  return handleResponse(response, username)
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

          return fetcher(url, accounts[0].username, {
            'x-msal-access-token': accessToken,
            'x-msal-id-token': idToken
          })
        },
    {
      // Uncomment next lines to log SWR events, useful for browser debugging
      // onError: (error) => {
      //   console.error('Data fetching error:', error)
      // },
      // onSuccess: (data) => {
      //   console.debug('Data fetched successfully:', data)
      // },
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
