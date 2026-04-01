import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Linked Contacts List API route', () => {
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
    vi.mocked(dalRequest).mockResolvedValue({})
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

  test('should sort customers by first then last name', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          customers: [
            {
              firstName: 'B',
              lastName: 'E'
            },
            {
              firstName: 'B',
              lastName: 'D'
            },
            {
              firstName: 'A',
              lastName: 'C'
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
      { firstName: 'A', lastName: 'C' },
      { firstName: 'B', lastName: 'D' },
      { firstName: 'B', lastName: 'E' }
    ])
  })

  test('should fail fast when DAL response code indicates an error has occurred', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      status: 400,
      statusText: 'Invalid request',
      json: async () => {
        return { error: 'Some error occurred' }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(response).toMatchObject({
      status: 400,
      statusText: 'Invalid request'
    })
    expect(await response.json()).toMatchObject({
      error: 'Some error occurred'
    })
  })
})
