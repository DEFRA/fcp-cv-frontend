import { dalRequest } from '@/lib/dal'
import { logger } from '@/lib/logger'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { beforeEach, describe, expect, test, vi } from 'vitest'

const acquireTokenByClientCredential = vi.fn()

vi.mock('@azure/msal-node', () => ({
  ConfidentialClientApplication: vi.fn(function () {
    return {
      acquireTokenByClientCredential
    }
  })
}))
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: vi.fn(() => 'mocked-token')
  }))
}))

vi.mock('@/lib/auth', () => ({
  getEmailFromToken: vi.fn(() => 'test@example.com')
}))
vi.mock('@/lib/logger', () => ({
  logger: { warn: vi.fn() }
}))
vi.mock('@/config', () => ({
  config: {
    get: vi.fn((key) => {
      const values = {
        logLevel: 'info',
        'dal.url': 'http://dal/graphql',
        'dal.tokenGeneration.scope': 'test.scope',
        'dal.tokenGeneration.clientId': 'client-id',
        'dal.tokenGeneration.authority': 'authority',
        'dal.tokenGeneration.clientSecret': 'secret',
        'dal.tokenGeneration.disabled': false
      }
      return values[key]
    })
  }
}))

beforeEach(() => {
  vi.clearAllMocks()

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        message: 'Test response'
      })
    })
  )

  acquireTokenByClientCredential.mockResolvedValue({
    accessToken: 'mock-access-token'
  })
})

describe('dalRequest', () => {
  test('client is only created once', async () => {
    await dalRequest({ query: '', variables: {} })
    await dalRequest({ query: '', variables: {} })

    expect(ConfidentialClientApplication).toHaveBeenCalledTimes(1)
  })

  test('makes DAL request with generated access token', async () => {
    const request = {
      query: 'query Test {}',
      variables: { a: 1 }
    }

    const response = await dalRequest(request)

    expect(acquireTokenByClientCredential).toHaveBeenCalledWith({
      scopes: ['test.scope']
    })

    expect(fetch).toHaveBeenCalledWith('http://dal/graphql', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'content-type': 'application/json',
        email: 'test@example.com',
        authorization: 'Bearer mock-access-token'
      }
    })

    expect(response).toEqual({ message: 'Test response' })
  })

  test('does not generate token when disabled', async () => {
    const { config } = await import('@/config')
    config.get.mockImplementation((key) => {
      if (key === 'dal.tokenGeneration.disabled') return true
      const values = { 'dal.url': 'http://dal/graphql' }
      return values[key]
    })

    const request = { query: '', variables: {} }
    const dal = await import('@/lib/dal?rand=1')
    await dal.dalRequest(request)

    expect(acquireTokenByClientCredential).not.toHaveBeenCalled()
    expect(fetch).toHaveBeenCalledWith('http://dal/graphql', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'content-type': 'application/json',
        email: 'test@example.com',
        authorization: ''
      }
    })
  })

  test('passes variables and query correctly', async () => {
    const request = {
      query: 'query Users { users { id } }',
      variables: { limit: 10 }
    }

    await dalRequest(request)

    const fetchCall = fetch.mock.calls[0]
    expect(JSON.parse(fetchCall[1].body)).toEqual(request)
  })

  test('returns parsed JSON response', async () => {
    const result = await dalRequest({ query: '', variables: {} })
    expect(result).toEqual({ message: 'Test response' })
  })

  test('handles errors during token retrieval', async () => {
    acquireTokenByClientCredential.mockRejectedValue(new Error('Token error'))
    await expect(() =>
      dalRequest({ query: '', variables: {} })
    ).rejects.toThrow('DAL token retrieval failed')
  })

  test('throws DalResponseError and logs warning on unsuccessful response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({
        errors: [
          { field: 'This is an error that should be stringified' },
          null,
          undefined,
          { stack: ['Stack', 'should', 'be', 'stringified'] }
        ]
      })
    })

    await expect(() =>
      dalRequest({ query: '', variables: {} })
    ).rejects.toMatchObject({
      message: 'Internal Server Error',
      status: 500,
      statusText: 'Internal Server Error'
    })

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        err: {
          message: `${JSON.stringify({ field: 'This is an error that should be stringified' })}\n${JSON.stringify(['Stack', 'should', 'be', 'stringified'])}`
        },
        req: expect.objectContaining({
          body: JSON.stringify({ query: '', variables: {} })
        }),
        res: expect.objectContaining({ status: 500 })
      }),
      'DAL request unsuccessful'
    )
  })

  test.each([
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [403, 'Forbidden'],
    [404, 'Not Found'],
    [502, 'Bad Gateway'],
    [503, 'Service Unavailable']
  ])(
    'throws DalResponseError with correct status and message for %i responses',
    async (status, statusText) => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status,
        statusText,
        json: async () => ({})
      })

      await expect(() =>
        dalRequest({ query: '', variables: {} })
      ).rejects.toMatchObject({ message: statusText, status, statusText })
    }
  )

  test('throws generic error when fetch fails due to a network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network failure'))

    await expect(() =>
      dalRequest({ query: '', variables: {} })
    ).rejects.toThrow(new Error('DAL request failed'))

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining(new Error('DAL request failed')),
      'DAL request failed'
    )
  })
})
