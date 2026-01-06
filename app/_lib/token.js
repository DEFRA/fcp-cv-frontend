/**
 * NOTE: This should be moved to the DAL
 * See FCPDAL-154 (https://eaflood.atlassian.net/browse/FCPDAL-154)
 */

import { createRemoteJWKSet, jwtVerify } from 'jose'
import { headers } from 'next/headers'

const JWKS_URL =
  'https://login.microsoftonline.com/6f504113-6b64-43f2-ade9-242e05780007/discovery/v2.0/keys'
const ISSUER =
  'https://login.microsoftonline.com/6f504113-6b64-43f2-ade9-242e05780007/v2.0'
const AUDIENCE = 'bfb6fb5c-9ec6-44f9-91d6-77378e41daa7'

const JWKS = createRemoteJWKSet(new URL(JWKS_URL))

export async function getEmailFromToken() {
  const authorization = (await headers()).get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    throw new Error('no auth header')
  }

  const token = authorization.slice('Bearer '.length)

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: AUDIENCE
    })

    const email = payload.email || payload.preferred_username

    if (!email) {
      throw new Error('no email in token')
    }

    return email
  } catch (err) {
    console.error('JWT verification failed')
    throw new Error('auth failed')
  }
}
