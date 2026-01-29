import convict from 'convict'

export const config = convict({
  userAuth: {
    redirectUri: {
      doc: 'The redirect URI registered in the Microsoft Entra ID app for sign-in callbacks',
      format: String,
      default: null,
      env: 'USER_AUTH_REDIRECT_URI'
    },
    authority: {
      doc: 'The Microsoft Entra ID authority URL, usually in the form https://login.microsoftonline.com/{tenantId}/v2.0',
      format: String,
      default: null,
      env: 'USER_AUTH_AUTHORITY'
    },
    jwksUrl: {
      doc: 'The JWKS URL provided by Microsoft Entra ID to verify JWT signatures (usually https://login.microsoftonline.com/{tenantId}/discovery/v2.0/keys)',
      format: String,
      default: null,
      env: 'USER_AUTH_JWKS_URL'
    },
    clientId: {
      doc: 'The Application (client) ID of the Microsoft Entra ID app registration',
      format: String,
      default: null,
      env: 'USER_AUTH_CLIENT_ID'
    },
    clientSecret: {
      doc: 'The client secret for the Microsoft Entra ID app registration',
      format: String,
      default: null,
      env: 'USER_AUTH_CLIENT_SECRET',
      sensitive: true
    }
  }
})
