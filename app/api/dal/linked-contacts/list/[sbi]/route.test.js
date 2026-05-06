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
    vi.mocked(dalRequest).mockResolvedValue({ data: {} })
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

  test('should return partial response with errors if dal request has errors', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {},
      errors: [{ message: 'some error' }]
    })
    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(206)
    expect(await response.json()).toEqual([])
  })

  test('should sort customers with missing firstName to the front of the list', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          customers: [
            { firstName: 'B', lastName: 'E' },
            { firstName: null, lastName: 'D' },
            { firstName: 'A', lastName: 'C' }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([
      { firstName: null, lastName: 'D' },
      { firstName: 'A', lastName: 'C' },
      { firstName: 'B', lastName: 'E' }
    ])
  })

  test('should sort customers with missing lastName to the front within the same firstName grouping', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          customers: [
            { firstName: 'A', lastName: 'B' },
            { firstName: 'A', lastName: null }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([
      { firstName: 'A', lastName: null },
      { firstName: 'A', lastName: 'B' }
    ])
  })

  test('should not throw when both firstName and lastName are null', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          customers: [
            { firstName: null, lastName: null },
            { firstName: 'A', lastName: 'B' }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([
      { firstName: null, lastName: null },
      { firstName: 'A', lastName: 'B' }
    ])
  })

  test('should return 500 if DAL request throws error', async () => {
    vi.mocked(dalRequest).mockRejectedValue(new Error('DAL error'))
    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(500)
  })
})
