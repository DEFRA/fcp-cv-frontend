import { createRemoteJWKSet, jwtVerify } from 'jose'

import { config } from '@/config'

export const clientAuthConfig = {
  disabled: config.get('userAuth.disabled'),
  authority: config.get('userAuth.authority'),
  clientId: config.get('userAuth.clientId'),
  redirectUri: config.get('userAuth.redirectUri')
}

const AUDIENCE = config.get('userAuth.clientId')
const ISSUER = config.get('userAuth.authority')
const JWKS_URL = config.get('userAuth.jwksUrl')

let cachedJWKS = null
function getJWKS() {
  if (!cachedJWKS) {
    cachedJWKS = createRemoteJWKSet(new URL(JWKS_URL))
  }
  return cachedJWKS
}
export async function getEmailFromToken(headers) {
  if (clientAuthConfig.disabled) return ''

  const authHeader = headers.get('authorization')

  if (!authHeader) throw new Error('no auth header')

  const match = authHeader.match(/^Bearer (.+)$/)
  if (!match) throw new Error('malformed auth header')

  const token = match[1]

  const { payload } = await jwtVerify(token, getJWKS(), {
    issuer: ISSUER,
    audience: AUDIENCE
  })

  const email = payload.email || payload.preferred_username
  if (!email) throw new Error('no email in token')

  return email
}
