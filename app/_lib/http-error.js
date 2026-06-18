export class HttpError extends Error {
  constructor(message, status, statusText) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
  }
}
