import { config } from '@/config'
import { summariseErrors } from '@/lib/api.js'
import { getEmailFromToken } from '@/lib/auth'
import { HttpError } from '@/lib/http-error'
import { logger } from '@/lib/logger'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { headers } from 'next/headers'

const DAL_AUTH_DISABLED = config.get('dal.tokenGeneration.disabled')

let client = null
function getClient() {
  if (!client) {
    client = new ConfidentialClientApplication({
      auth: {
        clientId: config.get('dal.tokenGeneration.clientId'),
        authority: config.get('dal.tokenGeneration.authority'),
        clientSecret: config.get('dal.tokenGeneration.clientSecret')
      }
    })
  }
  return client
}

async function getAccessToken() {
  try {
    const response = await getClient().acquireTokenByClientCredential({
      scopes: [config.get('dal.tokenGeneration.scope')]
    })

    return `Bearer ${response.accessToken}`
  } catch (err) {
    logger.warn({ err }, 'DAL token retrieval failed')

    throw new HttpError('DAL token retrieval failed', 401, 'Unauthorized')
  }
}

export async function dalRequest({ query, variables }) {
  const email = await getEmailFromToken(await headers())
  const authorization = DAL_AUTH_DISABLED ? '' : await getAccessToken()

  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json', email, authorization },
    body: JSON.stringify({ query, variables })
  }

  const response = await fetch(config.get('dal.url'), {
    ...req,
    signal: AbortSignal.timeout(config.get('dal.requestTimeout'))
  }).catch((err) => {
    if (err.name === 'HttpError') {
      throw err
    } else if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new HttpError(
        `Upstream request timed out: ${err.message}`,
        504,
        'Gateway Timeout'
      )
    }

    logger.warn({ err }, 'DAL request failed')
    throw new Error(`DAL request failed, caused by: ${err.message}`)
  })

  if (!response.ok) {
    const responseBody = await response.json()

    logger.warn(
      {
        err: new Error(summariseErrors(responseBody.errors)),
        req,
        res: response
      },
      'DAL request unsuccessful'
    )

    throw new HttpError(
      'DAL request unsuccessful',
      response.status,
      response.statusText
    )
  }

  return response.json()
}

export { HttpError }
