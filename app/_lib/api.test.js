import { handleApiError, partialResponse } from '@/lib/api'
import { logger } from '@/lib/logger'
import { expect, vi } from 'vitest'

vi.mock('@/lib/logger', () => ({
  logger: { warn: vi.fn() }
}))

describe('DAL API tests', () => {
  describe('partialResponse', () => {
    it('should combine DAL errors list into a single error', async () => {
      const res = partialResponse(
        { url: '/test' },
        ['Error 1', null, undefined, new Error('Error 2')],
        'Problem fetching data',
        { data: 'some data' }
      )

      expect(res.status).toBe(206)
      expect(res.statusText).toBe('Partial Content')
      expect(await res.json()).toEqual({ data: 'some data' })

      expect(logger.warn).toHaveBeenCalledOnce()
      const [info, warning] = logger.warn.mock.calls[0]
      expect(info.req).toEqual({ url: '/test' })
      expect(info.error.message).toContain(
        'Problem fetching data, DAL returned partial data with errors:'
      )
      expect(info.error.message).toContain('Error 1')
      expect(info.error.message).not.toContain('null')
      expect(info.error.message).not.toContain('undefined')
      expect(info.error.message).toContain('Error 2')
      expect(warning).toEqual('Problem fetching data')
    })
  })

  describe('handleApiError', () => {
    beforeEach(() => vi.clearAllMocks())

    it('uses the status code passed in', async () => {
      const error = { status: 400, statusText: 'Bad Request' }

      const res = handleApiError({ url: '/test' }, error, 'Bad request', 400)

      expect(res.status).toBe(400)
    })

    it('defaults to status 500 when no status is provided', async () => {
      const error = {}

      const res = handleApiError(
        { url: '/test' },
        error,
        'Something went wrong'
      )

      expect(res.status).toBe(500)
    })

    it('uses the statusText passed in', async () => {
      const error = { status: 400, statusText: 'Bad Request' }

      const res = handleApiError(
        { url: '/test' },
        error,
        'Bad request',
        400,
        'Bad Request'
      )

      expect(res.statusText).toBe('Bad Request')
    })

    it('defaults to statusText ServerError when no statusText is provided', async () => {
      const error = {}

      const res = handleApiError(
        { url: '/test' },
        error,
        'Something went wrong'
      )

      expect(res.statusText).toBe('ServerError')
    })

    it('uses the body passed in', async () => {
      const error = {}
      const body = { custom: 'payload' }

      const res = handleApiError(
        { url: '/test' },
        error,
        'Something went wrong',
        500,
        'ServerError',
        body
      )

      expect(await res.json()).toEqual({ custom: 'payload' })
    })

    it('defaults body to { error: message } when no body is provided', async () => {
      const error = {}

      const res = handleApiError(
        { url: '/test' },
        error,
        'Something went wrong'
      )

      expect(await res.json()).toEqual({ error: 'Something went wrong' })
    })
  })
})
