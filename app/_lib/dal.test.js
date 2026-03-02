import { dalRequest } from '@/lib/dal'

describe('DAL Request', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({
        message: 'Test response'
      })
    })

    vi.mock('@/lib/auth', () => ({
      getEmailFromToken: () => 'test@example.com'
    }))

    vi.mock('next/headers', () => ({
      headers: () => ({
        get: () => 'mocked-token'
      })
    }))
  })

  test('makes dal request', async () => {
    const request = { query: '', variables: {} }
    await dalRequest(request)

    expect(fetch).toHaveBeenCalled(1)
    expect(fetch).toHaveBeenCalledWith('http://dal/graphql', {
      body: JSON.stringify(request),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        email: 'test@example.com'
      }
    })
  })
})
