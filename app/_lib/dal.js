import { config } from '@/config'
import { getEmailFromToken } from '@/lib/auth'
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
  } catch (error) {
    logger.warn({ error }, 'DAL token retrieval failed')

    const cleanError = new Error('DAL token retrieval failed')
    cleanError.status = 401
    cleanError.statusText = 'Unauthorized'

    throw cleanError
  }
}

export async function dalRequest({ query, variables }) {
  const email = await getEmailFromToken(await headers())
  const authorization = DAL_AUTH_DISABLED ? '' : await getAccessToken()

  const response = await fetch(config.get('dal.url'), {
    method: 'POST',
    headers: { 'content-type': 'application/json', email, authorization },
    body: JSON.stringify({ query, variables })
  })

  if (!response.ok) {
    logger.warn('DAL request unsuccessful', { res: response })

    if (response.status === 404) {
      throw new NotFoundError(await response.json())
    }
  }

  return response.json()
}

export class NotFoundError extends Error {
  constructor(responsePayload) {
    super('Not Found')
    this.status = 404
    this.responsePayload = responsePayload
  }
}
