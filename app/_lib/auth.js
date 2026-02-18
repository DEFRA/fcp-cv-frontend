import { createRemoteJWKSet, jwtVerify } from 'jose'

import { config } from '@/config'

export const clientAuthConfig = {
  disabled: config.get('userAuth.disabled'),
  authority: config.get('userAuth.authority'),
  clientId: config.get('userAuth.clientId'),
  redirectUri: config.get('userAuth.redirectUri'),
  scope: config.get('userAuth.scope')
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
  if (clientAuthConfig.disabled) return config.get('dal.email')

  const token = headers.get('x-msal-id-token')

  if (!token) throw new Error('no id token')

  const { payload } = await jwtVerify(token, getJWKS(), {
    issuer: ISSUER,
    audience: AUDIENCE
  })

  const email = payload.email || payload.preferred_username
  if (!email) throw new Error('no email in token')

  return email
}
