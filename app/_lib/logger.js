import { ecsFormat } from '@elastic/ecs-pino-format'
import { getTraceId } from '@defra/hapi-tracing'
import pino from 'pino'

import { config } from '@/config'
import { reqSerialiser, resSerialiser } from '@/lib/log-serialisers'

const ecsOptions = {
  ...ecsFormat(),
  serializers: {
    req: reqSerialiser,
    res: resSerialiser
  }
}

const logger = pino({
  level: config.get('logLevel'),
  logPayload: true,
  ...ecsOptions,
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
