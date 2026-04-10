import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Authenticate API route', () => {
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

  test('should make dal request with crn param', async () => {
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

  test('should return memorable questions', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        customer: {
          authenticationQuestions: {
            isFound: true,
            memorableDate: '11/19/2024',
            memorableLocation: 'Stoltenberg-under-Bechtelar',
            memorableEvent: 'aureus',
            updatedAt: '2024-12-31T14:34:17.091Z'
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([
      {
        dd: '11/19/2024',
        dt: 'Memorable Date'
      },
      {
        dd: 'Stoltenberg-under-Bechtelar',
        dt: 'Memorable Location'
      },
      {
        dd: 'aureus',
        dt: 'Memorable Event'
      },
      {
        dd: '31/12/2024 14:34',
        dt: 'Updated At'
      }
    ])
  })
})
