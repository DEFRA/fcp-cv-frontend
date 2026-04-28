import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

const makeJwt = (claims) => {
  const header = Buffer.from(
    JSON.stringify({ alg: 'RS256', typ: 'JWT' })
  ).toString('base64url')
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url')
  return `${header}.${payload}.signature`
}

const defaultToken = makeJwt({ ipaddr: '203.0.113.1' })

const makeRequest = ({ sbi = 'sbiParam', headers = {} } = {}) => [
  new NextRequest('http://localhost', {
    headers: { 'x-msal-access-token': defaultToken, ...headers }
  }),
  { params: Promise.resolve({ sbi }) }
]

describe('Payments API route', () => {
  beforeAll(() => {
    vi.mock('next/headers', () => ({
      headers: () => ({
        get: () => 'mocked-token'
      })
    }))
    vi.mock('@/lib/auth', () => ({
      getEmailFromToken: () => 'test@example.com'
    }))
    vi.mock('@/lib/dal', () => ({
      dalRequest: vi.fn()
    }))
    vi.mock('@/lib/logger', () => ({
      logger: { warn: vi.fn() }
    }))
  })

  beforeEach(() => {
    vi.mocked(dalRequest).mockReset()
  })

  test('should extract userIP from ipaddr claim in MSAL access token', async () => {
    vi.mocked(dalRequest).mockResolvedValue({})

    await GET(
      ...makeRequest({
        headers: { 'x-msal-access-token': makeJwt({ ipaddr: '203.0.113.4' }) }
      })
    )

    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({ userIP: '203.0.113.4' })
      })
    )
  })

  test('should return 500 and warn when MSAL token is missing', async () => {
    const { logger } = await import('@/lib/logger')

    const response = await GET(
      ...makeRequest({ headers: { 'x-msal-access-token': null } })
    )

    expect(response.status).toBe(500)
    expect(logger.warn).toHaveBeenCalledWith(
      'Unable to resolve user IP address from MSAL access token'
    )
  })

  test('should return 500 and warn when MSAL token is malformed', async () => {
    const { logger } = await import('@/lib/logger')

    const response = await GET(
      ...makeRequest({
        headers: { 'x-msal-access-token': 'not.a.jwt' }
      })
    )

    expect(response.status).toBe(500)
    expect(logger.warn).toHaveBeenCalledWith(
      'Unable to resolve user IP address from MSAL access token'
    )
  })

  test('should return default payload when no payments data', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: { business: { payments: null } }
    })

    const response = await GET(...makeRequest())

    expect(await response.json()).toStrictEqual({ onHold: false, payments: [] })
  })

  test('should return payments with onHold unchanged', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          payments: {
            onHold: true,
            payments: [
              {
                reference: 'REF1',
                date: '2023-03-15',
                amount: 100,
                currency: 'GBP',
                lineItems: [
                  {
                    agreementClaimNo: 'AG001/CLM001',
                    scheme: '064',
                    marketingYear: '2023',
                    description: 'Test line item',
                    amount: 100
                  }
                ]
              }
            ]
          }
        }
      }
    })

    const response = await GET(...makeRequest())

    expect(await response.json()).toStrictEqual({
      onHold: true,
      payments: [
        {
          reference: 'REF1',
          date: '2023-03-15',
          amount: 100,
          currency: 'GBP',
          lineItems: [
            {
              agreementClaimNo: 'AG001/CLM001',
              scheme: '064',
              marketingYear: '2023',
              description: 'Test line item',
              amount: 100
            }
          ]
        }
      ]
    })
  })

  test('should sort payments by date ascending', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          payments: {
            onHold: false,
            payments: [
              {
                reference: 'MIDDLE',
                date: '2022-06-01',
                amount: 1,
                currency: 'GBP',
                lineItems: []
              },
              {
                reference: 'NEWEST',
                date: '2024-01-01',
                amount: 2,
                currency: 'GBP',
                lineItems: []
              },
              {
                reference: 'OLDEST',
                date: '2020-01-01',
                amount: 3,
                currency: 'GBP',
                lineItems: []
              }
            ]
          }
        }
      }
    })

    const response = await GET(...makeRequest())
    const { payments } = await response.json()

    expect(payments.map((p) => p.reference)).toStrictEqual([
      'OLDEST',
      'MIDDLE',
      'NEWEST'
    ])
  })

  test('should handle payments with missing date gracefully', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          payments: {
            onHold: false,
            payments: [
              {
                reference: 'WITH_DATE',
                date: '2023-01-01',
                amount: 1,
                currency: 'GBP',
                lineItems: []
              },
              {
                reference: 'NO_DATE',
                date: null,
                amount: 2,
                currency: 'GBP',
                lineItems: []
              }
            ]
          }
        }
      }
    })

    const response = await GET(...makeRequest())

    expect(response.status).toBe(200)
    const { payments } = await response.json()
    expect(payments).toHaveLength(2)
    expect(payments[0].reference).toBe('NO_DATE')
  })

  test('should return empty payments when dal response is missing data', async () => {
    vi.mocked(dalRequest).mockResolvedValue({})

    const response = await GET(...makeRequest())

    expect(await response.json()).toStrictEqual({ onHold: false, payments: [] })
  })

  test('should return partial response with errors if DAL response has errors', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {},
      errors: [{ message: 'some error' }]
    })

    const response = await GET(...makeRequest())

    expect(response.status).toBe(206)
    expect(await response.json()).toStrictEqual({
      onHold: false,
      payments: []
    })
  })

  test('should return 500 if DAL request throws error', async () => {
    vi.mocked(dalRequest).mockRejectedValue(new Error('DAL error'))

    const response = await GET(...makeRequest())

    expect(response.status).toBe(500)
  })
})
