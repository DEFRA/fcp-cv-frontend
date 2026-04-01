import { describe, test, expect, vi } from 'vitest'

const mockPino = vi.fn()

vi.mock('pino', () => ({ default: mockPino }))
vi.mock('@elastic/ecs-pino-format', () => ({
  ecsFormat: vi.fn().mockReturnValue({ ecs: true })
}))

describe('logger', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  test('should initialise pino with ecsFormat', async () => {
    await import('./logger.js')
    const { ecsFormat } = await import('@elastic/ecs-pino-format')

    const ecsOptions = ecsFormat.mock.results[0].value
    expect(mockPino).toHaveBeenCalledWith(ecsOptions)
  })
})
