import * as jose from 'jose'
import { vi } from 'vitest'

vi.mock('jose', () => ({
  createRemoteJWKSet: vi.fn(),
  decodeJwt: vi.fn(),
  jwtVerify: vi.fn()
}))

describe('getIPFromToken', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  test('returns 127.0.0.1 when auth disabled', async () => {
    vi.stubEnv('USER_AUTH_DISABLED', 'true')

    const { getIPFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => null) }

    expect(await getIPFromToken(headers)).toBe('127.0.0.1')
  })

  test('throws if no access token header', async () => {
    const { getIPFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => null) }

    await expect(getIPFromToken(headers)).rejects.toThrow(
      'Authorisation failure: no token provided'
    )
  })

  test('returns ipaddr from verified token', async () => {
    const { getIPFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockResolvedValue({ payload: { ipaddr: '203.0.113.1' } })

    expect(await getIPFromToken(headers)).toBe('203.0.113.1')
    expect(jose.jwtVerify.mock.calls[0][2]).toMatchObject({
      issuer: expect.stringContaining('sts.windows.net'),
      audience: expect.any(String)
    })
  })

  test('throws if token has no ipaddr claim', async () => {
    const { getIPFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockResolvedValue({ payload: {} })

    await expect(getIPFromToken(headers)).rejects.toThrow(
      'Authorisation failure: no ipaddr in token'
    )
  })

  test('throws if jwtVerify rejects', async () => {
    jose.decodeJwt.mockReturnValue({ tid: 'tenant-id', exp: 9999999999 })

    const { getIPFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'invalid.token.here') }

    jose.jwtVerify.mockRejectedValue(new Error('invalid signature'))

    await expect(getIPFromToken(headers)).rejects.toThrow(
      'Authorisation failure: token verification failed'
    )
  })
})

describe('getEmailFromToken', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  test('returns DAL_EMAIL when auth disabled', async () => {
    vi.stubEnv('USER_AUTH_DISABLED', 'true')

    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => null) }

    expect(await getEmailFromToken(headers)).toBe('test@defra.gov.uk')
  })

  test('throws if no access token header', async () => {
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => null) }

    await expect(getEmailFromToken(headers)).rejects.toThrow(
      'Authorisation failure: no token provided'
    )
  })

  test('throws if token has no email', async () => {
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockResolvedValue({ payload: {} })

    await expect(getEmailFromToken(headers)).rejects.toThrow(
      'no email in token'
    )
  })

  test('returns email from token', async () => {
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockResolvedValue({
      payload: { email: 'test@defra.gov.uk' }
    })

    const email = await getEmailFromToken(headers)
    expect(email).toBe('test@defra.gov.uk')
    expect(jose.jwtVerify.mock.calls[0][2]).toMatchObject({
      issuer: expect.any(String),
      audience: expect.any(String)
    })
  })

  test('returns preferred_username if email not present', async () => {
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockResolvedValue({
      payload: { preferred_username: 'user123' }
    })

    const email = await getEmailFromToken(headers)
    expect(email).toBe('user123')
  })

  test('throws if jwtVerify rejects', async () => {
    jose.decodeJwt.mockReturnValue({
      email: 'censored.name@thing.com',
      preferred_username: 'censored.name@other.net',
      ipaddr: '127.0.0.1'
    })
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    await expect(getEmailFromToken(headers)).rejects.toThrow(
      'Authorisation failure: token verification failed'
    )
  })

  test('caches the JWKS remote set', async () => {
    const { getEmailFromToken } = await import('./auth')

    const mockJWKS = vi.fn()
    jose.createRemoteJWKSet.mockReturnValue(mockJWKS)

    const headers = { get: vi.fn(() => 'valid.token') }
    jose.jwtVerify.mockResolvedValue({ payload: { email: 'test@example.com' } })

    await getEmailFromToken(headers)
    expect(jose.createRemoteJWKSet).toHaveBeenCalledTimes(1)

    await getEmailFromToken(headers)
    expect(jose.createRemoteJWKSet).toHaveBeenCalledTimes(1)
  })
})
