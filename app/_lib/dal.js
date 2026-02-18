import { config } from '@/config'
import { getEmailFromToken } from '@/lib/auth'
import { headers } from 'next/headers'

export async function dalRequest({ query, variables }) {
  const response = await fetch(config.get('dal.url'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      email: await getEmailFromToken(await headers())
      //   authorization: `Bearer ${token}` // TODO: Need to get a token for this!
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  if (response.status !== 200) {
    throw new Error('DAL request error')
  }

  return response.json()
}
