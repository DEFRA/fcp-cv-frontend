/**
 * Custom Server
 * See: https://nextjs.org/docs/app/guides/custom-server
 *
 * The default Next.js server does not output logs in a way that can be ingested by CDP.
 * This custom server implements HTTP logging using the require ECS format.
 * See: https://portal.cdp-int.defra.cloud/documentation/how-to/logging.md
 *
 * Additionally standard Next.js logging via console.xxx and direct stdout/stderr writes
 * are handled in instrumentation.js
 */

import { createServer } from 'http'
import next from 'next'
import { pinoHttp } from 'pino-http'
import logger from './app/_lib/logger.js'

const httpLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url.startsWith('/_next')
  }
})

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
