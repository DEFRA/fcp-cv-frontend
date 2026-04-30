import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

const toStandardRequest = (nextRequest) => {
  return {
    url: nextRequest.url,
    method: nextRequest.method,
    headers: nextRequest.headers && Object.fromEntries(nextRequest.headers)
  }
}

export function handleApiError(
  request,
  error,
  message,
  status = error.status ?? 500,
  statusText = error.statusText ?? 'ServerError',
  body = { error: message }
) {
  logger.warn(
    {
      error,
      req: toStandardRequest(request),
      'http/response/status_code': status
    },
    message
  )

  return NextResponse.json(body, { status, statusText })
}

export const summariseErrors = (errors) => {
  return errors
    ?.filter(Boolean)
    .map((er) => JSON.stringify(er?.stack ?? er))
    .join('\n')
}

export function partialResponse(req, errors, message, data) {
  return handleApiError(
    req,
    new Error(
      `${message}, DAL returned partial data with errors:\n${summariseErrors(errors)}`
    ),
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
