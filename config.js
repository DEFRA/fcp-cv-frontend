import convict from 'convict'

export const config = convict({
  userAuth: {
    disabled: {
      doc: 'Option to disable user authentication for local dev/testing',
      format: Boolean,
      default: null,
      nullable: true,
      env: 'USER_AUTH_DISABLED'
    },
    redirectUri: {
      doc: 'The redirect URI registered in the Microsoft Entra ID app for sign-in callbacks',
      format: String,
      default: null,
      env: 'USER_AUTH_REDIRECT_URI',
      nullable: process.env.USER_AUTH_DISABLED === 'true'
    },
    authority: {
      doc: 'The Microsoft Entra ID authority URL, usually in the form https://login.microsoftonline.com/{tenantId}/v2.0',
      format: String,
      default: null,
      env: 'USER_AUTH_AUTHORITY',
      nullable: process.env.USER_AUTH_DISABLED === 'true'
    },
    jwksUrl: {
      doc: 'The JWKS URL provided by Microsoft Entra ID to verify JWT signatures (usually https://login.microsoftonline.com/{tenantId}/discovery/v2.0/keys)',
      format: String,
      default: null,
      env: 'USER_AUTH_JWKS_URL',
      nullable: process.env.USER_AUTH_DISABLED === 'true'
    },
    clientId: {
      doc: 'The Application (client) ID of the Microsoft Entra ID app registration',
      format: String,
      default: null,
      env: 'USER_AUTH_CLIENT_ID',
      nullable: process.env.USER_AUTH_DISABLED === 'true'
    }
  }
})
