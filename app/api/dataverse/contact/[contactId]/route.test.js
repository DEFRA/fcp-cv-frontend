import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { headers } from 'next/headers'
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
      headers: vi.fn().mockReturnValue({ get: () => 'mocked-token' })
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
      params: Promise.resolve({ contactId: 'contactIdParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({ crn: '111111111' })
  })

  test('should return 404 if no crn number in dataverse response', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({})
    })

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

    expect(response.status).toBe(404)
  })

  test('should return 401 if no MSAL token in request headers', async () => {
    vi.mocked(headers).mockReturnValueOnce({ get: () => null })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ contactId: 'contactIdParam' })
    })

    expect(response.status).toBe(401)
  })

  test('should return 500 if dataverse request fails', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(
      new Error('Dataverse request failed')
    )

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ contactId: 'contactIdParam' })
    })

    expect(response.status).toBe(500)
  })
})
