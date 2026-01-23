import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  socialProviders: {
    microsoft: {
      clientId: process.env.AUTH_CLIENT_ID,
      tenantId: process.env.AUTH_TENANT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      authority: 'https://login.microsoftonline.com'
    }
  }
})
