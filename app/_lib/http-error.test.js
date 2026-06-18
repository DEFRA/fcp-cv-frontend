import { HttpError } from '@/lib/http-error'

describe('HttpError', () => {
  test('creates an error with message, status, and statusText', () => {
    const error = new HttpError('Test error', 400, 'Bad Request')

    expect(error.name).toBe('HttpError')
    expect(error.message).toBe('Test error')
    expect(error.status).toBe(400)
    expect(error.statusText).toBe('Bad Request')
  })
})
