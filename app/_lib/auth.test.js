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
    vi.stubEnv('USER_AUTH_DISABLED', 'false')
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

    await expect(getIPFromToken(headers)).rejects.toMatchObject({
      message: 'Authorisation failure: no token provided',
      status: 401,
      statusText: 'Unauthorized'
    })
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

    await expect(getIPFromToken(headers)).rejects.toMatchObject({
      message: 'Authorisation failure: no ipaddr in token',
      status: 403,
      statusText: 'Forbidden'
    })
  })

  test('throws if jwtVerify rejects', async () => {
    jose.decodeJwt.mockReturnValue({ tid: 'tenant-id', exp: 9999999999 })

    const { getIPFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'invalid.token.here') }

    jose.jwtVerify.mockRejectedValue(new Error('invalid signature'))

    await expect(getIPFromToken(headers)).rejects.toMatchObject({
      message: 'Authorisation failure: token verification failed',
      status: 401,
      statusText: 'Unauthorized'
    })
  })
})

describe('getEmailFromToken', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.resetModules()
    vi.unstubAllEnvs()
    vi.stubEnv('USER_AUTH_DISABLED', 'false')
  })

  // Auth disabled: immediately returns the email from DAL_EMAIL config.
  // No token is read or verified.
  test('returns DAL_EMAIL when auth disabled', async () => {
    vi.stubEnv('USER_AUTH_DISABLED', 'true')

    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => null) }

    const email = await getEmailFromToken(headers)
    expect(email).toBe('test@defra.gov.uk')
    expect(jose.jwtVerify).not.toHaveBeenCalled()
  })

  // Auth enabled + DAL_EMAIL set in config: token is still verified for
  // security, but the returned email comes from the config value, not the token.
  test('returns DAL_EMAIL when auth enabled but DAL_EMAIL is set', async () => {
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockResolvedValue({
      payload: { email: 'different.user@other.org' }
    })

    const email = await getEmailFromToken(headers)
    expect(email).toBe('test@defra.gov.uk') // from DAL_EMAIL, not from token
    expect(jose.jwtVerify).toHaveBeenCalledTimes(1)
  })

  // No token header provided: verifyToken fails early before any email logic.
  test('throws if no access token header', async () => {
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => null) }

    await expect(getEmailFromToken(headers)).rejects.toMatchObject({
      message: 'Authorisation failure: no token provided',
      status: 401,
      statusText: 'Unauthorized'
    })
  })

  // Token verifies successfully, but no email (or fallbacks) in payload and
  // no DAL_EMAIL override: should throw.
  test('throws if token has no email', async () => {
    vi.stubEnv('DAL_EMAIL', undefined)

    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockResolvedValue({ payload: {} })

    await expect(getEmailFromToken(headers)).rejects.toMatchObject({
      message: 'Authorisation failure: no email in token',
      status: 403,
      statusText: 'Forbidden'
    })

    expect(jose.jwtVerify).toHaveBeenCalled()
  })

  // Normal path: auth enabled, no DAL_EMAIL override, token verifies and
  // contains an email claim.
  test('returns email from token', async () => {
    vi.stubEnv('DAL_EMAIL', undefined)

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

  // Fallback when email claim is missing: use preferred_username from token.
  test('returns preferred_username if email not present', async () => {
    vi.stubEnv('DAL_EMAIL', undefined)

    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockResolvedValue({
      payload: { preferred_username: 'user123' }
    })

    const email = await getEmailFromToken(headers)
    expect(email).toBe('user123')
  })

  // Token verification fails (bad signature etc.). This error takes
  // precedence even if DAL_EMAIL is configured.
  test('throws if jwtVerify rejects', async () => {
    jose.decodeJwt.mockReturnValue({
      email: 'censored.name@thing.com',
      preferred_username: 'censored.name@other.net',
      ipaddr: '127.0.0.1'
    })
    const { getEmailFromToken } = await import('./auth')

    const headers = { get: vi.fn(() => 'valid.token.here') }

    jose.jwtVerify.mockRejectedValue(new Error('invalid signature'))

    await expect(getEmailFromToken(headers)).rejects.toMatchObject({
      message: 'Authorisation failure: token verification failed',
      status: 401,
      statusText: 'Unauthorized'
    })

    expect(jose.jwtVerify).toHaveBeenCalled()
  })

  test('caches the JWKS remote set', async () => {
    vi.stubEnv('DAL_EMAIL', undefined)

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
