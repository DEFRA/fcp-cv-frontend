import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose'

import { config } from '@/config'
import { logger } from '@/lib/logger'

const TENANT_BASE_URL = config.get('auth.tenantBaseUrl')
const ID_TOKEN_AUDIENCE = config.get('auth.appRegId')
const ID_TOKEN_ISSUER = `${TENANT_BASE_URL}/v2.0`
const JWKS_URL = `${TENANT_BASE_URL}/discovery/v2.0/keys`

// MSAL access tokens for Dataverse are v1 tokens — issuer is sts.windows.net,
// audience is the Dataverse resource URL.
const ACCESS_TOKEN_ISSUER = `https://sts.windows.net/${TENANT_BASE_URL.replace(/.*\//, '')}`
const ACCESS_TOKEN_AUDIENCE = config.get('crm.baseUrl')

export const clientAuthConfig = {
  disabled: config.get('auth.userLogin.disabled'),
  authority: ID_TOKEN_ISSUER,
  clientId: ID_TOKEN_AUDIENCE,
  redirectUri: config.get('auth.userLogin.redirectUri'),
  scope: `${ACCESS_TOKEN_AUDIENCE}/.default`
}

let remoteJWKSet = null
function getRemoteJWKSet() {
  if (!remoteJWKSet) {
    remoteJWKSet = createRemoteJWKSet(new URL(JWKS_URL))
  }
  return remoteJWKSet
}

async function verifyToken(token, { issuer, audience }) {
  if (!token) throw new Error('Authorisation failure: no token provided')

  try {
    const { payload } = await jwtVerify(token, getRemoteJWKSet(), {
      issuer,
      audience
    })
    return payload
  } catch (error) {
    const jwtInfo = decodeJwt(token)
    logger.warn({
      message: 'token verification failed',
      error,
      tenant: {
        message: JSON.stringify({
          aud: jwtInfo.aud,
          iss: jwtInfo.iss,
          oid: jwtInfo.oid,
          sid: jwtInfo.sid,
          tid: jwtInfo.tid,
          exp: jwtInfo.exp,
          iat: jwtInfo.iat,
          nbf: jwtInfo.nbf,
          email: jwtInfo.email?.split('@')[1],
          preferred_username: jwtInfo.preferred_username?.split('@')[1],
          ipaddr: jwtInfo.ipaddr
        })
      }
    })
    throw new Error('Authorisation failure: token verification failed')
  }
}

export async function getIPFromToken(headers) {
  if (clientAuthConfig.disabled) return '127.0.0.1'

  const token = headers.get('x-msal-access-token')
  const payload = await verifyToken(token, {
    issuer: ACCESS_TOKEN_ISSUER,
    audience: ACCESS_TOKEN_AUDIENCE
  })

  if (!payload.ipaddr)
    throw new Error('Authorisation failure: no ipaddr in token')
  return payload.ipaddr
}

export async function getEmailFromToken(headers) {
  if (clientAuthConfig.disabled) return config.get('testUserEmail')

  const token = headers.get('x-msal-id-token')
  const payload = await verifyToken(token, {
    issuer: ID_TOKEN_ISSUER,
    audience: ID_TOKEN_AUDIENCE
  })

  const email =
    payload?.email ??
    payload?.preferred_username ??
    payload?.verified_primary_email?.[0]

  if (!email) throw new Error('Authorisation failure: no email in token')
  return email
}
