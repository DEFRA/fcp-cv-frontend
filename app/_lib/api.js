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

  if (error.status === 404 && error.responsePayload?.errors?.length === 1) {
    // DAL has returned a NotFound response and a single un-ambiguous error definition.
    // The contract with the DAL means that in this scenario, we can trust the message returned and use it for client display
    return NextResponse.json(
      { displayableError: error.responsePayload.errors[0].message },
      { status: 404, statusText: 'Not Found' }
    )
  }
  return NextResponse.json(body, { status, statusText })
}

export function partialResponse(req, errors, message, data) {
  const error = errors.map((er) => er?.stack ?? JSON.stringify(er)).join('\n')
  return handleApiError(
    req,
    new Error(`${message}, DAL returned partial data with errors:\n${error}`),
    message,
    206,
    'Partial Content',
    data
  )
}

/**
 * Returns the response payload with a HTTP 200 response, unless the DAL response contains an errors array with at least one error.  If there
 * is an error then the error is logged and the response payload is still returned, but this time with a HTTP 206 (Partial Content) response code
 *
 * @param req the incoming request
 * @param apiResponse the GraphQL response returned from the DAL (used to check for errors)
 * @param responsePayload the payload that will be returned to the front end
 * @param partialErrorMessage if there has been a partial failure (errors array has content), then this string will be incorporated into the log message
 */
export function dalApiResponse(
  req,
  apiResponse,
  responsePayload,
  partialErrorMessage
) {
  if (apiResponse.errors?.length) {
    return partialResponse(
      req,
      apiResponse.errors,
      partialErrorMessage,
      responsePayload
    )
  }

  return Response.json(responsePayload)
}

export function unauthorised(req, error, message) {
  return handleApiError(req, error, message, 401, 'Unauthorized')
}

export function notFound(req, error, message) {
  return handleApiError(req, error, message, 404, 'Not Found')
}
