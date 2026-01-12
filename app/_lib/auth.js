import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      tenantId: process.env.MICROSOFT_TENANT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      authority: 'https://login.microsoftonline.com'
      // prompt: 'select_account'
    }
  }
})
