import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Linked Contacts Authenticate Questions API route', () => {
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

  test('should make dal request with sbi and crn param', async () => {
    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ crn: 'crnParam' }))
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

  test('should sort customers by first then last name', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        customer: {
          info: {
            dateOfBirth: '2025-01-01'
          },
          authenticationQuestions: {
            memorableDate: '11/19/2024',
            memorableLocation: 'memorableLocation',
            memorableEvent: 'memorableEvent',
            updatedAt: '2024-12-31T14:34:17.091Z'
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      items: [
        { dt: 'Date of Birth', dd: '01/01/2025' },
        { dt: 'Memorable Date', dd: '11/19/2024' },
        { dt: 'Memorable Location', dd: 'memorableLocation' },
        { dt: 'Memorable Event', dd: 'memorableEvent' },
        { dt: 'Updated at', dd: '31/12/2024' }
      ]
    })
  })
})
