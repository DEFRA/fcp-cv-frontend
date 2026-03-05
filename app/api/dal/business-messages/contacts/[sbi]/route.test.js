import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Business Messages Contacts API route', () => {
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
  })

  test('should make dal request with sbi param', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          customers: []
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)

    expect(dalRequest).toHaveBeenCalledTimes(1)
    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          sbi: 'sbiParam'
        })
      })
    )
  })

  test('should return customers list', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          customers: [
            {
              crn: '123',
              firstName: 'John',
              lastName: 'Doe'
            },
            {
              crn: '456',
              firstName: 'Jane',
              lastName: 'Smith'
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([
      { crn: '123', firstName: 'John', lastName: 'Doe' },
      { crn: '456', firstName: 'Jane', lastName: 'Smith' }
    ])
  })

  test('should return empty array when no customers', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          customers: null
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([])
  })
})
