import * as jose from 'jose'
import { beforeEach, describe, expect, vi } from 'vitest'
import { getEmailFromToken } from './auth'

vi.mock('jose', () => ({
  createRemoteJWKSet: vi.fn(),
  jwtVerify: vi.fn()
}))

describe('getEmailFromToken', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('throws if no authorization header', async () => {
    const headers = {
      get: vi.fn(() => null)
    }

    await expect(getEmailFromToken(headers)).rejects.toThrow('no auth header')
  })

  test('throws if authorization header is malformed', async () => {
    const headers = {
      get: vi.fn(() => 'InvalidHeader')
    }

    await expect(getEmailFromToken(headers)).rejects.toThrow(
      'malformed auth header'
    )
  })

  test('throws if token has no email', async () => {
    const token = 'valid.token.here'
    const headers = {
      get: vi.fn(() => `Bearer ${token}`)
    }

    jose.jwtVerify.mockResolvedValue({ payload: {} })

    await expect(getEmailFromToken(headers)).rejects.toThrow(
      'no email in token'
    )
  })

  test('returns email from token', async () => {
    const token = 'valid.token.here'
    const headers = {
      get: vi.fn(() => `Bearer ${token}`)
    }

    jose.jwtVerify.mockResolvedValue({ payload: { email: 'test@example.com' } })

    const email = await getEmailFromToken(headers)
    expect(email).toBe('test@example.com')
  })

  test('returns preferred_username if email not present', async () => {
    const token = 'valid.token.here'
    const headers = {
      get: vi.fn(() => `Bearer ${token}`)
    }

    jose.jwtVerify.mockResolvedValue({
      payload: { preferred_username: 'user123' }
    })

    const email = await getEmailFromToken(headers)
    expect(email).toBe('user123')
  })

  test('throws "auth failed" if jwtVerify throws', async () => {
    const token = 'valid.token.here'
    const headers = {
      get: vi.fn(() => `Bearer ${token}`)
    }

    jose.jwtVerify.mockRejectedValue(new Error('bad token'))

    await expect(getEmailFromToken(headers)).rejects.toThrow('bad token')
  })
})
