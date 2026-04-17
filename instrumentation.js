import { logger } from '@/lib/logger.js'

// Next JS adds colour styling to some of the log messages, leading to hard-to-read
// log messages when they are converted to JSON.  This RegEx identifies the colour
// escape codes, so that the colouring can be removed from the message
const ANSI_COLOUR_ESCAPE = /\x1B\[[0-9;]*m/g

const readConfig = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { config } = await import('@/config')
      config.validate({ allowed: 'strict' })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        throw error
      }

      logger.error(`Startup failed. Invalid configuration: ${error.message}`)

      process.exit(1)
    }
  }
}

/**
 * Redefines all console logging, so that our pino logger is used, in
 * preference to simple console logging
 */
const redefineConsoleLogging = () => {
  console.log = (...args) => logger.info(args.join(' '))
  console.info = (...args) => logger.info(args.join(' '))
  console.warn = (...args) => logger.warn(args.join(' '))
  console.error = (...args) => logger.error(args.join(' '))
  console.debug = (...args) => logger.debug(args.join(' '))
  console.trace = (...args) => logger.trace(args.join(' '))
}

/**
 * Intercepts all messages sent to the supplied stream.   If it has not already been JSON formatted,
 * pass to pino logger for formatting (at the supplied log level), otherwise pass straight through to
 * the underlying stream
 *
 * @param stream the output stream, should be process.stdout or process.stderr
 * @param pinoLoggerFunction the logger function to target, such as info(), debug() etc
 */
const interceptLogStream = (stream, pinoLoggerFunction) => {
  // Capture the original write to stream (so that we can use it without recursively calling
  // the overridden stream write
  const writeToStreamDirectly = stream.write.bind(stream)

  // Overwrite the stream, so that non-json formatted text is redirected to PINO
  stream.write = (chunk, ...args) => {
    const message = chunk?.toString().trim().replace(ANSI_COLOUR_ESCAPE, '')

    if (message) {
      try {
        // If it's already a JSON object (e.g. from pino itself), pass it through
        JSON.parse(message)
        return writeToStreamDirectly(chunk, ...args)
      } catch {
        // Plain text from Next.js internals — wrap in ECS format
        pinoLoggerFunction(message)
        return true
      }
    }
    return writeToStreamDirectly(chunk, ...args)
  }
}

// Next.js uses a mixture of console.logging and in some cases even just writes directly to stdout/stderr!
// Ensure that each flavour of logging is converted to ECS JSON format
const redirectAllLogging = () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    redefineConsoleLogging()
    interceptLogStream(process.stdout, (message) => logger.info(message))
    interceptLogStream(process.stderr, (message) => logger.error(message))
  }
}

export async function register() {
  redirectAllLogging()
  await readConfig()
}
