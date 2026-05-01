// The default implementation of ecsFormat's convertReqRes option only handles Node.js http.IncomingMessage/ServerResponse.
// These serialisers modify this behaviour, so that NextRequest/Request(used by fetch) and NextResponse/Response
// can be logged into appropriate ECS schema fields.
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
