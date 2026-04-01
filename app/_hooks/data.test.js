import { beforeAll, describe, expect } from 'vitest'
import { renderHook } from 'vitest-browser-react'

import { useAuth } from '@/components/auth/auth-provider'
import { useDal, useDataverse } from '@/hooks/data'
import { notification } from '@/components/notification/Notifications.jsx'

describe('useDal and useDataverse Hooks', () => {
  beforeAll(() => {
    vi.mock('@azure/msal-react', async () => ({
      useMsal: () => ({
        accounts: [{ username: 'test@user.com' }],
        instance: {
          acquireTokenSilent: () => ({
            accessToken: 'fake-access-token',
            idToken: 'fake-id-token'
          })
        },
        inProgress: 'none'
      })
    }))

    vi.mock('@/components/auth/auth-provider', async () => ({
      useAuth: vi.fn()
    }))
  })

  let fetchSpy

  beforeEach(() => {
    fetchSpy = vi.spyOn(window, 'fetch')
    fetchSpy.mockImplementation(async () => ({
      ok: true,
      json: Promise.resolve()
    }))

    vi.mock('@/components/notification/Notifications', () => {
      return {
        notification: {
          error: vi.fn(),
          warn: vi.fn()
        }
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('auth enabled', () => {
    beforeAll(() => {
      useAuth.mockReturnValue({ isDisabled: false })
    })

    it('renders useDal hook', async () => {
      await renderHook(() => useDal(['linked-contacts']))

      expect(fetchSpy).toHaveBeenCalledWith('/api/dal/linked-contacts', {
        headers: {
          'x-msal-access-token': 'fake-access-token',
          'x-msal-id-token': 'fake-id-token'
        }
      })
    })

    it('renders useDataverse hook', async () => {
      await renderHook(() => useDataverse(['account']))

      expect(fetchSpy).toHaveBeenCalledWith('/api/dataverse/account', {
        headers: {
          'x-msal-access-token': 'fake-access-token',
          'x-msal-id-token': 'fake-id-token'
        }
      })
    })
  })

  describe('auth disabled', () => {
    beforeAll(() => {
      useAuth.mockReturnValue({ isDisabled: true })
    })

    it('renders useDal hook', async () => {
      await renderHook(() => useDal(['linked-contacts']))

      expect(fetchSpy).toHaveBeenCalledWith('/api/dal/linked-contacts', {
        headers: {}
      })
    })

    it('renders useDataverse hook', async () => {
      await renderHook(() => useDataverse(['account']))

      expect(fetchSpy).toHaveBeenCalledWith('/api/dataverse/account', {
        headers: {}
      })
    })

    it('request error', async () => {
      fetchSpy.mockImplementation(async () => ({
        ok: false,
        json: Promise.resolve(),
        status: 'test error status',
        statusText: 'test error status text'
      }))

      const { result } = await renderHook(() => useDal(['linked-contacts']))
      expect(result.current.error).toStrictEqual(
        new Error('Request failed: test error status test error status text')
      )
      expect(notification.error).toHaveBeenCalledWith(
        'An error has occurred. Please report this if it continues to occur.'
      )
    })

    it('request error (when fetch throws)', async () => {
      fetchSpy.mockRejectedValue(new Error('Failure'))
      const { result } = await renderHook(() => useDal(['linked-contacts']))
      expect(result.current.error).toStrictEqual(new Error('Failure'))
      expect(notification.error).toHaveBeenCalledWith(
        'An error has occurred. Please report this if it continues to occur.'
      )
    })

    test.each([401, 403])('DAL auth (%i) error', async (statusCode) => {
      fetchSpy.mockImplementation(async () => ({
        ok: false,
        json: Promise.resolve(),
        status: statusCode,
        statusText: 'test error status text'
      }))

      const { result } = await renderHook(() => useDal(['linked-contacts']))
      expect(result.current.error).toStrictEqual(
        new Error(`Request failed: ${statusCode} test error status text`)
      )
      expect(notification.error).toHaveBeenCalledWith(
        'You do not have permissions to view this data.'
      )
    })

    it('does not fetch when parts of the URL are false', async () => {
      await renderHook(() => useDal(['linked-contacts', false]))

      expect(fetchSpy).not.toHaveBeenCalledOnce()
    })

    it('does not fetch when parts runWhenTruthy is false', async () => {
      await renderHook(() => useDal(['linked-contacts'], [false]))

      expect(fetchSpy).not.toHaveBeenCalledOnce()
    })
  })
})
