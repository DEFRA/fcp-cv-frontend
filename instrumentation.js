export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { config } = await import('@/config')
      config.validate({ allowed: 'strict' })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        throw error
      }

      const { ecsFormat } = await import('@elastic/ecs-pino-format')
      const pino = await import('pino')

      pino({ ...ecsFormat() }).error(
        `Startup failed. Invalid configuration: ${error.message}`
      )

      process.exit(1)
    }
  }
}
