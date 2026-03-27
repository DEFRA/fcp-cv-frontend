import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose'

import { config } from '@/config'
import { logger } from '@/lib/logger'

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

let remoteJWKSet = null
function getRemoteJWKSet() {
  if (!remoteJWKSet) {
    remoteJWKSet = createRemoteJWKSet(new URL(JWKS_URL))
  }
  return remoteJWKSet
}

export async function getEmailFromToken(headers) {
  if (clientAuthConfig.disabled) return config.get('dal.email')

  const token = headers.get('x-msal-id-token')

  if (!token) throw new Error('Authorisation failure: no jwt token provided')

  let email

  try {
    const jkws = await getRemoteJWKSet()
    const { payload } = await jwtVerify(token, jkws, {
      issuer: ISSUER,
      audience: AUDIENCE
    })

    email =
      payload?.email ??
      payload?.preferred_username ??
      payload?.verified_primary_email?.[0]
  } catch (error) {
    const jwtInfo = decodeJwt(token)
    logger.warn({
      message: 'token verification failed',
      error,
      tenant: {
        message: JSON.stringify({
          aud: jwtInfo.aud,
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

  if (!email) throw new Error('Authorisation failure: no email in token')

  return email
}
