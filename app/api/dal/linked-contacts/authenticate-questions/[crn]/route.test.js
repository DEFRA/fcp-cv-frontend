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
    vi.mocked(dalRequest).mockResolvedValue({})

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
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      items: [
        { dt: 'Date of Birth', dd: '01/01/2025' },
        { dt: 'Memorable Date', dd: '11/19/2024' },
        { dt: 'Memorable Location', dd: 'memorableLocation' },
        { dt: 'Memorable Event', dd: 'memorableEvent' },
        { dt: 'Updated At', dd: '31/12/2024 14:34' }
      ]
    })
  })

  test('should return (Not set) for missing fields', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: { customer: { info: null, authenticationQuestions: null } }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ crn: 'crnParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      items: [
        { dt: 'Date of Birth', dd: '(Not set)' },
        { dt: 'Memorable Date', dd: '(Not set)' },
        { dt: 'Memorable Location', dd: '(Not set)' },
        { dt: 'Memorable Event', dd: '(Not set)' },
        { dt: 'Updated At', dd: '(Not set)' }
      ]
    })
  })

  test('should return partial response with errors if DAL response has errors', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {},
      errors: [{ message: 'some error' }]
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ crn: 'crnParam' })
    })

    expect(response.status).toBe(206)
  })

  test('should return 500 if DAL request throws error', async () => {
    vi.mocked(dalRequest).mockRejectedValue(new Error('DAL error'))

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ crn: 'crnParam' })
    })

    expect(response.status).toBe(500)
  })
})
