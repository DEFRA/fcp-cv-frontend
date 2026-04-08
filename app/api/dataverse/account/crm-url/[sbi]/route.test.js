import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Dataverse Account CRM URL API route', () => {
  beforeAll(() => {
    vi.mock('@/lib/dataverse', () => ({
      lookupAccountIdBySbi: vi.fn()
    }))

    vi.mock('@/lib/crm', () => ({
      getCrmAccountUrl: vi.fn()
    }))

    vi.mock('next/headers', () => ({
      headers: () => ({
        get: () => 'mocked-token'
      })
    }))
  })

  test('should lookup account by sbi and return crm url', async () => {
    const { lookupAccountIdBySbi } = await import('@/lib/dataverse')
    const { getCrmAccountUrl } = await import('@/lib/crm')

    lookupAccountIdBySbi.mockResolvedValue({ id: 'accountId123' })
    getCrmAccountUrl.mockReturnValue('https://crm.url/accountId123')

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    expect(lookupAccountIdBySbi).toHaveBeenCalledWith(
      '123456789',
      'mocked-token'
    )
    expect(getCrmAccountUrl).toHaveBeenCalledWith('accountId123')

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      url: 'https://crm.url/accountId123'
    })
  })

  test('should return error when lookup fails', async () => {
    const { lookupAccountIdBySbi } = await import('@/lib/dataverse')

    lookupAccountIdBySbi.mockResolvedValue({ error: 'Account not found' })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    expect(lookupAccountIdBySbi).toHaveBeenCalledWith(
      '123456789',
      'mocked-token'
    )

    expect(response.status).toBe(404)
    expect(await response.json()).toStrictEqual({
      error: 'Problem retrieving Account ID with SBI: 123456789'
    })
  })
})
