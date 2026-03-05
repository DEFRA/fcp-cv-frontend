import { config } from '@/config'
import { getEmailFromToken } from '@/lib/auth'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { headers } from 'next/headers'

let client = null
function getClient() {
  if (!client) {
    client = new ConfidentialClientApplication({
      auth: {
        clientId: config.get('dal.tokenGenerationClientId'),
        authority: config.get('dal.tokenGenerationAuthority'),
        clientSecret: config.get('dal.tokenGenerationClientSecret')
      }
    })
  }
  return client
}

async function getAccessToken() {
  const response = await getClient().acquireTokenByClientCredential({
    scopes: [config.get('dal.tokenGenerationScope')]
  })

  return response.accessToken
}

export async function dalRequest({ query, variables }) {
  const response = await fetch(config.get('dal.url'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      email: await getEmailFromToken(await headers()),
      authorization: config.get('dal.tokenGenerationDisabled')
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
