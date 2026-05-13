import convict from 'convict'

export const config = convict({
  logLevel: {
    doc: 'Logging level',
    format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    default: process.env.NODE_ENV === 'test' ? 'error' : 'info',
    env: 'LOG_LEVEL'
  },
  testUserEmail: {
    doc: 'Email address to send to DAL for local dev/testing when auth is disabled',
    format: String,
    default: null,
    env: 'TEST_USER_EMAIL',
    nullable: process.env.DAL_AUTH_DISABLED !== 'true'
  },
  dalUrl: {
    doc: 'URL for Data Access Layer (DAL)',
    format: String,
    default: null,
    env: 'DAL_URL',
    nullable: false
  },
  auth: {
    tenantBaseUrl: {
      doc: 'The base URL of the Microsoft tenant, in the form https://login.microsoftonline.com/{tenantId}',
      format: String,
      default: '',
      env: 'AUTH_TENANT_BASE_URL',
      nullable:
        process.env.USER_AUTH_DISABLED === 'true' &&
        process.env.DAL_AUTH_DISABLED === 'true'
    },
    appRegId: {
      doc: 'The Application (client) ID of the Microsoft Entra ID app registration',
      format: String,
      default: null,
      env: 'CV_APP_REG_ID',
      nullable:
        process.env.USER_AUTH_DISABLED === 'true' &&
        process.env.DAL_AUTH_DISABLED === 'true'
    },
    userLogin: {
      disabled: {
        doc: 'Option to disable user authentication for local dev/testing',
        format: Boolean,
        default: null,
        nullable: true,
        env: 'USER_AUTH_DISABLED'
      },
      redirectUri: {
        doc: 'The redirect URI registered in the Microsoft Entra ID app for post sign-in callbacks',
        format: String,
        default: null,
        env: 'USER_AUTH_REDIRECT_URI',
        nullable: process.env.USER_AUTH_DISABLED === 'true'
      }
    },
    dalLogin: {
      disabled: {
        doc: 'Option to disable token generation for local dev/testing',
        format: Boolean,
        default: null,
        nullable: true,
        env: 'DAL_AUTH_DISABLED'
      },
      clientSecret: {
        doc: 'Client Secret used to generate token to access DAL',
        format: String,
        default: null,
        env: 'DAL_AUTH_CLIENT_SECRET',
        nullable: process.env.DAL_AUTH_DISABLED === 'true'
      }
    }
  },
  iframeMessenger: {
    crmOrigin: {
      doc: 'The origin of the CRM instance',
      format: String,
      default: null,
      env: 'IFRAME_MESSENGER_CRM_ORIGIN',
      nullable: true
    }
  },
  crm: {
    baseUrl: {
      doc: 'Base URL for CRM instance (e.g., https://example.crm4.dynamics.com/)',
      format: String,
      default: null,
      env: 'CRM_BASE_URL',
      nullable: true
    },
    dataversePath: {
      doc: 'The path for the Dataverse API of this CRM instance, defaults to: api/data/v9.2',
      format: String,
      default: 'api/data/v9.2',
      env: 'CRM_DATAVERSE_PATH'
    },
    appId: {
      doc: 'CRM app ID (UUID) (e.g., 12345678-1234-1234-1234-123456789abc)',
      format: String,
      default: null,
      env: 'CRM_APP_ID',
      nullable: true
    }
  }
})
