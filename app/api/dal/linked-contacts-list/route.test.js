import { vi } from 'vitest'
import { NextRequest } from 'next/server.js'

import { GET } from './route.js'

describe('LinkedContactsList API route tests', () => {
  beforeAll(() => {
    vi.mock('next/headers.js', () => ({
      headers: () => ({
        get: () => 'mocked-token'
      })
    }))
    vi.mock('@/lib/auth.js', () => ({
      getEmailFromToken: () => 'test@example.com'
    }))
  })

  it('should return a list of contacts', async () => {
    const response = await GET(
      new NextRequest('http://localhost/api/dal/linked-contacts-list')
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('firstName')
    expect(data[0]).toHaveProperty('lastName')
    expect(data[0]).toHaveProperty('crn')
  })
})
