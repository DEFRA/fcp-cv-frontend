import { createRemoteJWKSet, jwtVerify } from 'jose'

const JWKS_URL = process.env.AUTH_JWKS_URL
const ISSUER = process.env.AUTH_AUTHORITY
const AUDIENCE = process.env.AUTH_CLIENT_ID

const JWKS = createRemoteJWKSet(new URL(JWKS_URL))

export async function getEmailFromToken(headers) {
  const authHeader = headers.get('authorization')

  if (!authHeader) throw new Error('no auth header')

  const match = authHeader.match(/^Bearer (.+)$/)
  if (!match) throw new Error('malformed auth header')

  const token = match[1]

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: ISSUER,
    audience: AUDIENCE
  })

  const email = payload.email || payload.preferred_username
  if (!email) throw new Error('no email in token')

  return email
}
