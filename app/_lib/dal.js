import { config } from '@/config'
import { getEmailFromToken } from '@/lib/auth'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { headers } from 'next/headers'

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

  return response.json()
}
