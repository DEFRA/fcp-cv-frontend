import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Dataverse Account API route', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({
        rpa_sbinumber: '111111111'
      })
    })

    vi.mock('next/headers', () => ({
      headers: () => ({
        get: () => 'mocked-token'
      })
    }))
  })

  test('should make dataverse request with accountId param', async () => {
    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ accountId: 'accountIdParam' }))
    })

    expect(fetch).toHaveBeenCalled(1)
    expect(fetch).toHaveBeenCalledWith(
      'https://tenant.dynamics.com/api/data/v9.2/accounts(accountIdParam)?$select=rpa_sbinumber',
      {
        headers: {
          Authorization: 'Bearer mocked-token'
        }
      }
    )

    expect(response.status).toBe(200)
  })

  test('should return dataverse response', async () => {
    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ accountId: 'accountIdParam' }))
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({ sbi: '111111111' })
  })
})
