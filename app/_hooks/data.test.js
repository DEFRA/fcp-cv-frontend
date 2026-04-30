import { beforeAll, describe, expect } from 'vitest'
import { renderHook } from 'vitest-browser-react'

import { useAuth } from '@/components/auth/auth-provider'
import { ButtonLink } from '@/components/button-link/ButtonLink'
import { useDal, useDataverse } from '@/hooks/data'
import { reloadPage } from '@/hooks/reload-page'
import { notification } from '@/components/notification/Notifications'

vi.mock('@/hooks/reload-page', () => ({ reloadPage: vi.fn() }))

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
          warning: vi.fn()
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

    test.each([401, 403])(
      'DAL auth (%i) error includes email address when present',
      async (statusCode) => {
        fetchSpy.mockImplementation(async () => ({
          ok: false,
          json: Promise.resolve(),
          status: statusCode,
          statusText: 'test error status text'
        }))

        await renderHook(() => useDal(['linked-contacts']))

        expect(notification.error).toHaveBeenCalledWith(
          `You do not have permissions to view this data.
        Make sure you have an active Rural Payments Portal account with email address <test@user.com>. See Consolidated View guidance for more information.`
        )
      }
    )
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

    it('returns useDal hook', async () => {
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

      expect(result.current.error).toMatchObject({
        message: 'Request failed: test error status test error status text',
        status: 'test error status',
        handleNotification: false
      })

      expect(notification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'span',
          props: expect.objectContaining({
            children: expect.arrayContaining([
              'An error has occurred. Please report this if it continues to occur.',
              expect.objectContaining({
                type: ButtonLink,
                props: expect.objectContaining({ children: 'Click to retry.' })
              })
            ])
          })
        })
      )
    })

    it('request error - click to retry triggers a page reload', async () => {
      fetchSpy.mockImplementation(async () => ({
        ok: false,
        json: Promise.resolve(),
        status: 'test error status',
        statusText: 'test error status text'
      }))

      await renderHook(() => useDal(['linked-contacts']))

      const [notificationContent] = notification.error.mock.calls[0]
      const buttonLink = notificationContent.props.children.find(
        (child) => child?.type === ButtonLink
      )
      buttonLink.props.onClick()

      expect(reloadPage).toHaveBeenCalledOnce()
    })

    it('request error (when fetch throws)', async () => {
      fetchSpy.mockRejectedValue(new Error('Failure'))

      const { result } = await renderHook(() => useDal(['linked-contacts']))

      expect(result.current.error).toStrictEqual(new Error('Failure'))
      expect(notification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'span',
          props: expect.objectContaining({
            children: expect.arrayContaining([
              'An error has occurred. Please report this if it continues to occur.',
              expect.objectContaining({
                type: ButtonLink,
                props: expect.objectContaining({ children: 'Click to retry.' })
              })
            ])
          })
        })
      )
    })

    it('request error (when fetch throws) - click to retry invokes window.location.reload', async () => {
      fetchSpy.mockRejectedValue(new Error('Failure'))

      await renderHook(() => useDal(['linked-contacts']))

      const [notificationContent] = notification.error.mock.calls[0]
      const buttonLink = notificationContent.props.children.find(
        (child) => child?.type === ButtonLink
      )
      buttonLink.props.onClick()

      expect(reloadPage).toHaveBeenCalledOnce()
    })

    test.each([401, 403])('DAL auth (%i) error', async (statusCode) => {
      fetchSpy.mockImplementation(async () => ({
        ok: false,
        json: Promise.resolve(),
        status: statusCode,
        statusText: 'test error status text'
      }))

      const { result } = await renderHook(() => useDal(['linked-contacts']))

      expect(result.current.error).toMatchObject({
        message: `Request failed: ${statusCode} test error status text`,
        status: statusCode,
        handleNotification: false
      })

      expect(notification.error).toHaveBeenCalledWith(
        `You do not have permissions to view this data.
        Make sure you have an active Rural Payments Portal account. See Consolidated View guidance for more information.`
      )
    })

    test('not found response (HTTP 404) does not show a notification', async () => {
      fetchSpy.mockImplementation(async () => ({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }))

      const { result } = await renderHook(() => useDal(['linked-contacts']))

      expect(notification.error).not.toHaveBeenCalled()
      expect(result.current.error).toMatchObject({
        message: 'Request failed: 404 Not Found',
        status: 404,
        handleNotification: true
      })
    })

    it('partial DAL failure(HTTP response 206)', async () => {
      fetchSpy.mockImplementation(async () => ({
        ok: true,
        json: Promise.resolve(),
        status: 206,
        statusText: 'partial content'
      }))

      await renderHook(() => useDal(['linked-contacts']))

      expect(notification.warning).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'span',
          props: expect.objectContaining({
            children: expect.arrayContaining([
              'An error has occurred. Some data may be missing.',
              expect.objectContaining({
                type: ButtonLink,
                props: expect.objectContaining({ children: 'Click to retry.' })
              })
            ])
          })
        })
      )
    })

    it('partial DAL failure(HTTP response 206) - click to retry triggers a page reload', async () => {
      fetchSpy.mockImplementation(async () => ({
        ok: true,
        json: Promise.resolve(),
        status: 206,
        statusText: 'partial content'
      }))

      await renderHook(() => useDal(['linked-contacts']))

      const [notificationContent] = notification.warning.mock.calls[0]
      const buttonLink = notificationContent.props.children.find(
        (child) => child?.type === ButtonLink
      )
      buttonLink.props.onClick()

      expect(reloadPage).toHaveBeenCalledOnce()
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
