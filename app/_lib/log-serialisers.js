// ecsFormat's convertReqRes option only handles Node.js http.IncomingMessage/ServerResponse.
// These serialisers extend that behaviour to Web API Request/Response objects (used by
// NextRequest and fetch), which expose their fields via prototype getters that JSON.stringify
// cannot enumerate. The fallback in each serialiser preserves ecsFormat's handling for
// standard Node.js request and response objects.

export const reqSerialiser = (req) => {
  if (req.headers instanceof Headers) {
    return {
      method: req.method,
      url: req.url,
      remoteAddress: req.ip,
      headers: Object.fromEntries(req.headers)
    }
  }
  return req
}

export const resSerialiser = (res) => {
  if (res.statusCode === undefined && typeof res.status === 'number') {
    return {
      statusCode: res.status,
      statusMessage: res.statusText,
      url: res.url,
      headers: res.headers && Object.fromEntries(res.headers)
    }
  }
  return res
}
