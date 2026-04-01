import { config } from '@/config'
import { getEmailFromToken } from '@/lib/auth'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { headers } from 'next/headers'
import logger from '@/lib/logger.js'

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
  const response = await getClient().acquireTokenByClientCredential({
    scopes: [config.get('dal.tokenGeneration.scope')]
  })

  return response.accessToken
}

async function handleResponse(response) {
  const responseBody = response.body ? await response.json() : null

  if (!response.ok) {
    if (response.status >= 500) {
      logger.error(
        `DAL request has failed <%d> %s`,
        response.status,
        JSON.stringify(responseBody)
      )
    } else {
      logger.warn(
        `DAL request has failed <%d> %s`,
        response.status,
        JSON.stringify(responseBody)
      )
    }

    return Response.json(
      { error: 'There was a problem retrieving DAL data' },
      { status: response.status, statusText: response.statusText }
    )
  } else {
    if (responseBody.errors && responseBody.errors.length > 0) {
      logger.warn(
        `Partial failure of DAL request: %s`,
        JSON.stringify(responseBody.errors)
      )

      return { ...responseBody, partialContent: true }
    }
  }
  return responseBody
}

export async function dalRequest({ query, variables }) {
  const response = await fetch(config.get('dal.url'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      email: await getEmailFromToken(await headers()),
      authorization: config.get('dal.tokenGeneration.disabled')
        ? ''
        : `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  return handleResponse(response)
}
