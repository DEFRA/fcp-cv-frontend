import { logger } from '@/lib/logger'
import { describe, expect } from 'vitest'

describe('logger', () => {
  test('setup the logger', () => {
    expect(logger).toBeDefined()
  })
})
