import { createRemoteJWKSet, jwtVerify } from 'jose'

import { config } from '@/config'

export const clientAuthConfig = {
  authority: config.get('userAuth.authority'),
  clientId: config.get('userAuth.clientId'),
  redirectUri: config.get('userAuth.redirectUri')
}

const JWKS_URL = config.get('userAuth.jwksUrl')
const ISSUER = config.get('userAuth.authority')
const AUDIENCE = config.get('userAuth.clientId')

const JWKS = createRemoteJWKSet(
  new URL(
    JWKS_URL ||
      'https://login.microsoftonline.com/{tenantId}/discovery/v2.0/keys'
  )
)

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
