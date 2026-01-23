import { ConfidentialClientApplication } from '@azure/msal-node'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

const client = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    authority: process.env.AUTH_AUTHORITY
  }
})

const authRequest = {
  redirectUri: new URL(
    '/api/auth/callback/microsoft-entra-id',
    process.env.AUTH_BASE_URL
  ),
  scopes: ['openid', 'profile', 'email']
}

export async function getSignInUrl() {
  return client.getAuthCodeUrl(authRequest)
}

export async function getToken(code) {
  return client.acquireTokenByCode({
    code,
    ...authRequest
  })
}

export async function getSession() {
  return getIronSession(await cookies(), {
    password: process.env.AUTH_SECRET,
    cookieName: 'cv-session',
    ttl: 3600, // 1 hr
    cookieOptions: {
      sameSite: 'none'
    }
  })
}

export async function createSession(email) {
  const session = await getSession()
  session.email = email
  await session.save()
}
