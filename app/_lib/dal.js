import { config } from '@/config'
import { summariseErrors } from '@/lib/api.js'
import { getEmailFromToken } from '@/lib/auth'
import { HttpError } from '@/lib/http-error'
import { logger } from '@/lib/logger'
import { ConfidentialClientApplication } from '@azure/msal-node'
import {
  buildASTSchema,
  buildClientSchema,
  getOperationAST,
  getVariableValues,
  introspectionFromSchema,
  parse
} from 'graphql'
import { GraphQLBigInt } from 'graphql-scalars'
import { headers } from 'next/headers'

const DAL_AUTH_DISABLED = config.get('dal.tokenGeneration.disabled')

let clientSchema = null
function getClientSchema() {
  if (!clientSchema) {
    const schemaSource = readFileSync(
      new URL('./dal-schema.graphql', import.meta.url),
      'utf8'
    )
    const schemaDocument = parse(schemaSource)
    const schema = buildASTSchema(schemaDocument)

    const bigIntType = schema.getType('BigInt')
    if (bigIntType) {
      bigIntType.serialize = GraphQLBigInt.serialize
      bigIntType.parseValue = GraphQLBigInt.parseValue
      bigIntType.parseLiteral = GraphQLBigInt.parseLiteral
    }

    clientSchema = buildClientSchema(introspectionFromSchema(schema))

    const clientBigIntType = clientSchema.getType('BigInt')
    if (clientBigIntType) {
      clientBigIntType.serialize = GraphQLBigInt.serialize
      clientBigIntType.parseValue = GraphQLBigInt.parseValue
      clientBigIntType.parseLiteral = GraphQLBigInt.parseLiteral
    }
  }

  return clientSchema
}

function validateVariables({ query, variables }) {
  let document
  try {
    document = parse(query)
  } catch (err) {
    logger.warn(
      {
        err,
        tenant: {
          message: JSON.stringify({ query, variables })
        }
      },
      'DAL request variable validation failed: could not parse query'
    )

    return variables
  }

  const operation = getOperationAST(document)
  if (!operation?.variableDefinitions?.length) {
    return variables
  }

  const { errors, coerced } = getVariableValues(
    getClientSchema(),
    operation.variableDefinitions,
    variables ?? {}
  )
  if (errors?.length) {
    const errorMessage = errors.map((error) => error.message).join('; ')
    logger.warn(
      {
        err: new Error(errorMessage),
        query,
        variables
      },
      'DAL request variable validation failed'
    )

    throw new HttpError(
      'DAL request failed: invalid variables',
      400,
      'Bad Request'
    )
  }

  return coerced
}

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
  try {
    const response = await getClient().acquireTokenByClientCredential({
      scopes: [config.get('dal.tokenGeneration.scope')]
    })

    return `Bearer ${response.accessToken}`
  } catch (err) {
    logger.warn({ err }, 'DAL token retrieval failed')

    throw new HttpError('DAL token retrieval failed', 401, 'Unauthorized')
  }
}

export async function dalRequest({ query, variables }) {
  const email = await getEmailFromToken(await headers())
  const authorization = DAL_AUTH_DISABLED ? '' : await getAccessToken()

  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json', email, authorization },
    body: JSON.stringify({ query, variables })
  }

  const response = await fetch(config.get('dal.url'), {
    ...req,
    signal: AbortSignal.timeout(config.get('dal.requestTimeout'))
  }).catch((err) => {
    if (err.name === 'HttpError') {
      throw err
    } else if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new HttpError(
        `Upstream request timed out: ${err.message}`,
        504,
        'Gateway Timeout'
      )
    }

    logger.warn({ err }, 'DAL request failed')
    throw new Error(`DAL request failed, caused by: ${err.message}`)
  })

  if (!response.ok) {
    const responseBody = await response.json()

    logger.warn(
      {
        err: new Error(summariseErrors(responseBody.errors)),
        req,
        res: response
      },
      'DAL request unsuccessful'
    )

    throw new HttpError(
      'DAL request unsuccessful',
      response.status,
      response.statusText
    )
  }

  return response.json()
}
