import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose'

import { config } from '@/config'
import { HttpError } from '@/lib/http-error'
import { logger } from '@/lib/logger'

export const clientAuthConfig = {
  disabled: config.get('userAuth.disabled'),
  authority: config.get('userAuth.authority'),
  clientId: config.get('userAuth.clientId'),
  redirectUri: config.get('userAuth.redirectUri'),
  scope: config.get('userAuth.scope')
}

const ID_TOKEN_AUDIENCE = config.get('userAuth.clientId')
const ID_TOKEN_ISSUER = config.get('userAuth.authority')
const JWKS_URL = config.get('userAuth.jwksUrl')

// MSAL access tokens for Dataverse are v1 tokens — issuer is sts.windows.net,
// audience is the Dataverse resource URL.
const ACCESS_TOKEN_ISSUER = config.get('userAuth.accessTokenIssuer')
const ACCESS_TOKEN_AUDIENCE = (() => {
  const url = config.get('dataverse.url')
  return url ? new URL(url).origin : null
})()

let remoteJWKSet = null
function getRemoteJWKSet() {
  if (!remoteJWKSet) {
    remoteJWKSet = createRemoteJWKSet(new URL(JWKS_URL))
  }
  return remoteJWKSet
}

async function verifyToken(token, { issuer, audience }) {
  if (!token)
    throw new HttpError(
      'Authorisation failure: no token provided',
      401,
      'Unauthorized'
    )

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
    throw new HttpError(
      'Authorisation failure: token verification failed',
      401,
      'Unauthorized'
    )
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
    throw new HttpError(
      'Authorisation failure: no ipaddr in token',
      403,
      'Forbidden'
    )
  return payload.ipaddr
}

const overrideEmail = config.get('dal.email')

export async function getEmailFromToken(headers) {
  if (clientAuthConfig.disabled) return overrideEmail

  const accessToken = headers.get('x-msal-access-token')
  const accessTokenPayload = await verifyToken(accessToken, {
    issuer: ACCESS_TOKEN_ISSUER,
    audience: ACCESS_TOKEN_AUDIENCE
  })

  const email = overrideEmail ?? accessTokenPayload?.upn

  if (!email)
    throw new HttpError(
      'Authorisation failure: no email in token',
      403,
      'Forbidden'
    )
  return email
}
