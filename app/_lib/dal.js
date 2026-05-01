import { config } from '@/config'
import { getEmailFromToken } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { headers } from 'next/headers'
import { summariseErrors } from '@/lib/api.js'

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
    logger.warn({ err: error }, 'DAL token retrieval failed')

    const cleanError = new Error('DAL token retrieval failed')
    cleanError.status = 401
    cleanError.statusText = 'Unauthorized'

    throw cleanError
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

  const response = await fetch(config.get('dal.url'), req).catch((error) => {
    logger.warn({ err: error }, 'DAL request failed')
    throw new Error('DAL request failed')
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

    throw new DalResponseError(response.status, response.statusText)
  }

  return response.json()
}

class DalResponseError extends Error {
  constructor(status, statusText) {
    super(statusText)
    this.status = status
    this.statusText = statusText
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      statusText: this.statusText
    }
  }
}
