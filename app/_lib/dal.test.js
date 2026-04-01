import { dalRequest } from '@/lib/dal'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import logger from '@/lib/logger.js'

const acquireTokenByClientCredential = vi.fn()

vi.mock('@azure/msal-node', () => ({
  ConfidentialClientApplication: vi.fn(function () {
    return {
      acquireTokenByClientCredential
    }
  })
}))

vi.mock('@/lib/auth', () => ({
  getEmailFromToken: vi.fn(() => 'test@example.com')
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: vi.fn(() => 'mocked-token')
  }))
}))

vi.mock('@/config', () => ({
  config: {
    get: vi.fn((key) => {
      const values = {
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

vi.mock('@/lib/logger.js', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn()
  }
}))

beforeEach(() => {
  vi.clearAllMocks()

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      body: new Blob(['Not actually read, but needs to exist']).stream(),
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
    await dalRequest(request)

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

  test('returns a generic error when response status is 500 and logs at error level', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 500,
        statusText: 'Some internal error occurred',
        ok: false,
        body: new Blob(['Not actually read, but needs to exist']).stream(),
        json: async () => ({
          message: 'Test response'
        })
      })
    )

    const result = await dalRequest({ query: '', variables: {} })

    console.log(result.status)
    expect(result).toMatchObject({
      status: 500,
      statusText: 'Some internal error occurred'
    })
    expect(await result.json()).toMatchObject({
      error: 'There was a problem retrieving DAL data'
    })
    expect(logger.error).toHaveBeenCalledWith(
      'DAL request has failed <%d> %s',
      500,
      JSON.stringify({
        message: 'Test response'
      })
    )
  })

  test('returns a generic error when response status is 400 and logs at warn level', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 400,
        statusText: 'Some internal error occurred',
        ok: false,
        body: new Blob(['Not actually read, but needs to exist']).stream(),
        json: async () => ({
          message: 'Test response'
        })
      })
    )

    const result = await dalRequest({ query: '', variables: {} })

    expect(result).toMatchObject({
      status: 400,
      statusText: 'Some internal error occurred'
    })
    expect(await result.json()).toMatchObject({
      error: 'There was a problem retrieving DAL data'
    })
    expect(logger.warn).toHaveBeenCalledWith(
      'DAL request has failed <%d> %s',
      400,
      JSON.stringify({
        message: 'Test response'
      })
    )
  })

  test('add a partialContent field to the DAL response when DAL request was successful, but errors are present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        body: new Blob(['Not actually read, but needs to exist']).stream(),
        json: async () => ({
          message: 'Test response',
          errors: [{ message: 'Some partial retrieval error' }]
        })
      })
    )

    const result = await dalRequest({ query: '', variables: {} })

    expect(result).toMatchObject({
      message: 'Test response',
      errors: [{ message: 'Some partial retrieval error' }],
      partialContent: true
    })

    expect(logger.warn).toHaveBeenCalledWith(
      'Partial failure of DAL request: %s',
      JSON.stringify([{ message: 'Some partial retrieval error' }])
    )
  })
})
