import { GET } from './route'

describe('Payments API route', () => {
  test('returns 200 with payments array and onHold field', async () => {
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(body.payments)).toBe(true)
    expect(typeof body.onHold).toBe('boolean')
  })

  test('payments have reference, date, amount and line_items', async () => {
    const response = await GET()
    const body = await response.json()

    expect(body.payments.length).toBeGreaterThan(0)

    for (const payment of body.payments) {
      expect(payment).toHaveProperty('reference')
      expect(payment).toHaveProperty('date')
      expect(payment).toHaveProperty('amount')
      expect(Array.isArray(payment.line_items)).toBe(true)
    }
  })

  test('line items have expected fields', async () => {
    const response = await GET()
    const body = await response.json()

    for (const payment of body.payments) {
      for (const item of payment.line_items) {
        expect(item).toHaveProperty('agreement_reference')
        expect(item).toHaveProperty('claim_number')
        expect(item).toHaveProperty('scheme')
        expect(item).toHaveProperty('marketing_year')
        expect(item).toHaveProperty('description')
        expect(item).toHaveProperty('amount')
      }
    }
  })
})
