import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Dataverse Account API route', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({
        rpa_capcustomerid: '111111111'
      })
    })

    vi.mock('next/headers', () => ({
      headers: () => ({
        get: () => 'mocked-token'
      })
    }))
  })

  test('should make dataverse request with contactId param', async () => {
    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ contactId: 'contactIdParam' })
    })

    expect(fetch).toHaveBeenCalled(1)
    expect(fetch).toHaveBeenCalledWith(
      'https://tenant.dynamics.com/api/data/v9.2/contacts(contactIdParam)?$select=rpa_capcustomerid',
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
      params: Promise.resolve({ accountId: 'accountIdParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({ crn: '111111111' })
  })
})
