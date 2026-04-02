import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Dataverse Contact CRM URL API route', () => {
  beforeAll(() => {
    vi.mock('@/lib/dataverse', () => ({
      lookupContactIdByCrn: vi.fn()
    }))

    vi.mock('@/lib/crm', () => ({
      getCrmContactUrl: vi.fn()
    }))

    vi.mock('next/headers', () => ({
      headers: () => ({
        get: () => 'mocked-token'
      })
    }))
  })

  test('should lookup contact by crn and return crm url', async () => {
    const { lookupContactIdByCrn } = await import('@/lib/dataverse')
    const { getCrmContactUrl } = await import('@/lib/crm')

    lookupContactIdByCrn.mockResolvedValue({ id: 'contactId123' })
    getCrmContactUrl.mockReturnValue('https://crm.url/contactId123')

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ crn: '123456789' })
    })

    expect(lookupContactIdByCrn).toHaveBeenCalledWith(
      '123456789',
      'mocked-token'
    )
    expect(getCrmContactUrl).toHaveBeenCalledWith('contactId123')

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      url: 'https://crm.url/contactId123'
    })
  })

  test('should return error when lookup fails', async () => {
    const { lookupContactIdByCrn } = await import('@/lib/dataverse')

    lookupContactIdByCrn.mockResolvedValue({ error: 'Contact not found' })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ crn: '123456789' })
    })

    expect(lookupContactIdByCrn).toHaveBeenCalledWith(
      '123456789',
      'mocked-token'
    )

    expect(response.status).toBe(404)
    expect(await response.json()).toStrictEqual({ error: 'Contact not found' })
  })
})
