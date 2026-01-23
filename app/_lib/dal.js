import { getSession } from '@/lib/auth.js'

export async function dalRequest(query, variables) {
  const session = await getSession()

  if (!session.email) {
    throw new Error('no session')
  }

  const response = await fetch(process.env.DAL_URL, {
    method: 'POST',
    headers: {
      email: session.email,
      authorization: '' // TODO: need to pass CV app token
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  return response.json()
}
