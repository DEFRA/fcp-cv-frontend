import { NextRequest } from 'next/server.js'
import { GET } from './route.js'

describe('GET /health', () => {
  it('returns { message: "success" } with status 200', async () => {
    const response = await GET(new NextRequest('http://localhost/health'))

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual({ message: 'success' })
  })
})
