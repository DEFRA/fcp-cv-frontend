import * as jose from 'jose'
import { vi } from 'vitest'

vi.mock('jose', () => ({
  createRemoteJWKSet: vi.fn(),
  jwtVerify: vi.fn()
}))

describe('getEmailFromToken', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  test('returns empty DAL_EMAIL when auth disabled', async () => {
    vi.stubEnv('USER_AUTH_DISABLED', 'true')

    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => null) }

    expect(await getEmailFromToken(headers)).toBe('test@defra.gov.uk')
  })

  test('throws if no authorization header (auth enabled by default)', async () => {
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => null) }

    await expect(getEmailFromToken(headers)).rejects.toThrow('no id token')
  })

  test('throws if token has no email', async () => {
    const { getEmailFromToken } = await import('./auth')

    const token = 'valid.token.here'
    const headers = { get: vi.fn(() => `Bearer ${token}`) }

    jose.jwtVerify.mockResolvedValue({ payload: {} })

    await expect(getEmailFromToken(headers)).rejects.toThrow(
      'no email in token'
    )
  })

  test('returns email from token', async () => {
    const { getEmailFromToken } = await import('./auth')

    const token = 'valid.token.here'
    const headers = { get: vi.fn(() => `Bearer ${token}`) }

    jose.jwtVerify.mockResolvedValue({
      payload: { email: 'test@defra.gov.uk' }
    })

    const email = await getEmailFromToken(headers)
    expect(email).toBe('test@defra.gov.uk')
  })

  test('returns preferred_username if email not present', async () => {
    const { getEmailFromToken } = await import('./auth')

    const token = 'valid.token.here'
    const headers = { get: vi.fn(() => `Bearer ${token}`) }

    jose.jwtVerify.mockResolvedValue({
      payload: { preferred_username: 'user123' }
    })

    const email = await getEmailFromToken(headers)
    expect(email).toBe('user123')
  })

  test('throws if jwtVerify rejects', async () => {
    const { getEmailFromToken } = await import('./auth')

    const token = 'valid.token.here'
    const headers = { get: vi.fn(() => `Bearer ${token}`) }

    await expect(getEmailFromToken(headers)).rejects.toThrow(
      'token verification failed'
    )
  })

  test('caches the JWKS remote set', async () => {
    const { getEmailFromToken } = await import('./auth')

    const mockJWKS = vi.fn()
    jose.createRemoteJWKSet.mockReturnValue(mockJWKS)

    const headers = { get: vi.fn(() => 'Bearer valid.token') }
    jose.jwtVerify.mockResolvedValue({ payload: { email: 'test@example.com' } })

    await getEmailFromToken(headers)
    expect(jose.createRemoteJWKSet).toHaveBeenCalledTimes(1)

    await getEmailFromToken(headers)
    expect(jose.createRemoteJWKSet).toHaveBeenCalledTimes(1)
  })
})
