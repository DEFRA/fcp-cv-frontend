import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Linked Businesses List API route', () => {
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

  test('should make dal request with crm param', async () => {
    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ crn: 'crnParam' })
    })

    expect(response.status).toBe(200)

    expect(dalRequest).toHaveBeenCalledTimes(1)
    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          crn: 'crnParam'
        })
      })
    )
  })

  test('should return linked businesses', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        customer: {
          businesses: [
            {
              sbi: '1111111111',
              name: 'Maggio, Murray and Dicki'
            },
            {
              sbi: '2222222222',
              name: "O'Keefe, Prosacco and Friesen"
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam', crn: 'crnParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([
      { sbi: '1111111111', name: 'Maggio, Murray and Dicki' },
      { sbi: '2222222222', name: "O'Keefe, Prosacco and Friesen" }
    ])
  })
})
