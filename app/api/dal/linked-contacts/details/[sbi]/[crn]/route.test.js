import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Linked Contacts Details API route', () => {
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
      params: new Promise((resolve) =>
        resolve({ sbi: 'sbiParam', crn: 'crnParam' })
      )
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
          customer: {
            role: 'Role',
            permissionGroups: [
              {
                id: 'UPPERCASE_ID',
                level: 'UPPERCASE_LEVEL',
                functions: ['Function 1', 'Function 2']
              }
            ]
          }
        },
        customer: {
          crn: 'crn',
          info: {
            name: {
              title: 'title',
              first: 'first',
              middle: 'middle',
              last: 'last'
            },
            dateOfBirth: '2025-01-01'
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      displayName: 'first last',
      details: [
        { dt: 'CRN', dd: 'crn' },
        { dt: 'Full Name', dd: 'title first middle last' },
        { dt: 'Role', dd: 'Role' }
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
})
