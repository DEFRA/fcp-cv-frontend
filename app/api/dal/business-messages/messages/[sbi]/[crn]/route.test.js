import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Business Messages List API route', () => {
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

  test('should make dal request with sbi and crn params', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        customer: {
          business: {
            messages: []
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) =>
        resolve({ sbi: 'sbiParam', crn: 'crnParam' })
      )
    })

    expect(response.status).toBe(200)

    expect(dalRequest).toHaveBeenCalledTimes(1)
    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          sbi: 'sbiParam',
          crn: 'crnParam'
        })
      })
    )
  })

  test('should include fromDate param when provided in query string', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        customer: {
          business: {
            messages: []
          }
        }
      }
    })

    const response = await GET(
      new NextRequest('http://localhost?fromDate=2024-01-01'),
      {
        params: new Promise((resolve) =>
          resolve({ sbi: 'sbiParam', crn: 'crnParam' })
        )
      }
    )

    expect(response.status).toBe(200)

    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          sbi: 'sbiParam',
          crn: 'crnParam',
          fromDate: '2024-01-01'
        })
      })
    )
  })

  test('should return messages list', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        customer: {
          business: {
            messages: [
              {
                id: 'msg1',
                subject: 'Test Message 1',
                date: '2024-01-01',
                body: 'Message body 1',
                read: true,
                deleted: false
              },
              {
                id: 'msg2',
                subject: 'Test Message 2',
                date: '2024-01-02',
                body: 'Message body 2',
                read: false,
                deleted: false
              }
            ]
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) =>
        resolve({ sbi: 'sbiParam', crn: 'crnParam' })
      )
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([
      {
        id: 'msg1',
        subject: 'Test Message 1',
        date: '2024-01-01',
        body: 'Message body 1',
        read: true,
        deleted: false
      },
      {
        id: 'msg2',
        subject: 'Test Message 2',
        date: '2024-01-02',
        body: 'Message body 2',
        read: false,
        deleted: false
      }
    ])
  })

  test('should return empty array when no messages', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        customer: {
          business: {
            messages: null
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) =>
        resolve({ sbi: 'sbiParam', crn: 'crnParam' })
      )
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([])
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
      params: new Promise((resolve) =>
        resolve({ sbi: 'sbiParam', crn: 'crnParam' })
      )
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
