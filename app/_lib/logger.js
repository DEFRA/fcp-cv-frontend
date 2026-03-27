import { ecsFormat } from '@elastic/ecs-pino-format'
import { getTraceId } from '@defra/hapi-tracing'
import pino from 'pino'

import { config } from '@/config'

const logger = pino({
  level: config.get('logLevel'),
  logPayload: true,
  ...ecsFormat(),
  nesting: true,
  mixin() {
    const mixinValues = {}
    const traceId = getTraceId()
    if (traceId) {
      mixinValues.trace = { id: traceId }
    }
    return mixinValues
  }
})

export { logger }
