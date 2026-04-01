import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

export function handleApiError(
  req,
  error,
  message,
  status = error.status ?? 500,
  statusText = error.statusText ?? 'ServerError',
  body = { error: message }
) {
  logger.warn({ error, req }, message)

  return NextResponse.json(body, { status, statusText })
}

export function partialResponse(req, errors, message, data) {
  const error = errors.map((er) => er?.stack ?? er?.toString() ?? er).join('\n')
  return handleApiError(
    req,
    new Error(`${message}, DAL returned partial data with errors:\n${error}`),
    message,
    206,
    'Partial Content',
    data
  )
}

export function unauthorised(req, error, message) {
  return handleApiError(req, error, message, 401, 'Unauthorized')
}

export function notFound(req, error, message) {
  return handleApiError(req, error, message, 404, 'Not Found')
}
