import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Linked Businesses Details API route', () => {
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
      params: Promise.resolve({ sbi: 'sbiParam', crn: 'crnParam' })
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

  test('should return linked businesses', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        customer: {
          business: {
            name: 'Maggio, Murray and Dicki',
            sbi: '1111111111',
            role: 'Business Partner',
            permissionGroups: [
              {
                id: 'UPPERCASE_ID',
                level: 'UPPERCASE_LEVEL',
                functions: ['Function 1', 'Function 2']
              }
            ]
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam', crn: 'crnParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      name: 'Maggio, Murray and Dicki',
      details: [
        { dt: 'SBI', dd: '1111111111' },
        { dt: 'Role', dd: 'Business Partner' }
      ],
      permissions: [
        {
          dt: 'Uppercase Id',
          dd: 'Uppercase Level',
          expand: ['Function 1', 'Function 2']
        }
      ]
    })
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
