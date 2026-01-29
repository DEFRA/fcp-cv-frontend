/**
 * Custom Server
 * See: https://nextjs.org/docs/app/guides/custom-server
 *
 * The default Next.js server does not output logs in a way that can be ingested by CDP.
 * This custom server implements HTTP logging using the require ECS format.
 * See: https://portal.cdp-int.defra.cloud/documentation/how-to/logging.md
 */

import { ecsFormat } from '@elastic/ecs-pino-format'
import { createServer } from 'http'
import next from 'next'
import pino from 'pino'
import { pinoHttp } from 'pino-http'

import { config } from './config.js'

const logger = pino({
  ...ecsFormat()
})

const httpLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url.startsWith('/_next')
  }
})

try {
  config.validate({ allowed: 'strict' })
} catch (error) {
  logger.error(`Startup failed. Invalid configuration: ${error.message}`)
  process.exit(1)
}

const port = parseInt(process.env.PORT || '3000', 10)

const app = next({})
await app.prepare()

const handle = app.getRequestHandler()

createServer((req, res) => {
  handle(req, res, URL.parse(req.url))
  httpLogger(req, res)
}).listen(port, () => {
  logger.info('Server started successfully')
})
