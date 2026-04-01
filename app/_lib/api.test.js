import { partialResponse } from '@/lib/api'
import { logger } from '@/lib/logger'
import { expect, vi } from 'vitest'

vi.mock('@/lib/logger', () => ({
  logger: { warn: vi.fn() }
}))

describe('DAL API tests', () => {
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
