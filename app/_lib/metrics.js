import { Metrics } from '@defra/cdp-metrics'

import { logger } from '@/lib/logger'

export const metrics = new Metrics(logger)

export function extractOperationName(query) {
  return /(?:^|\n)\s*(?:query|mutation|subscription)\s+(\w+)/.exec(query)?.[1]
}
