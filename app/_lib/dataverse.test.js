import { describe, expect, it, vi, beforeEach } from 'vitest'

import { lookupContactIdByCrn, lookupAccountIdBySbi } from './dataverse'

vi.mock('@/config', () => ({
  config: {
    get: vi.fn((key) => {
      const values = {
        'dataverse.url': 'https://dataverse.example.com',
        'dataverse.requestTimeout': 30000
      }
      return values[key]
    })
  }
}))

vi.mock('@/lib/metrics', () => ({
  metrics: { millis: vi.fn() }
}))

describe('Dataverse lookup functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('lookupContactIdByCrn', () => {
    it('returns contact ID when found', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ value: [{ contactid: 'contact-123' }] })
        })
      )

      const result = await lookupContactIdByCrn('crn-456', 'token')

      expect(result).toEqual({ id: 'contact-123' })
      expect(fetch).toHaveBeenCalledWith(
        "https://dataverse.example.com/contacts?$filter=rpa_capcustomerid eq 'crn-456'&$select=contactid",
        {
          headers: { Authorization: 'Bearer token' },
          signal: expect.any(AbortSignal)
        }
      )
    })

    it('returns error when contact not found', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ value: [] })
        })
      )

      const result = await lookupContactIdByCrn('crn-456', 'token')

      expect(result).toEqual({ error: 'Contact not found' })
    })
  })

  describe('lookupAccountIdBySbi', () => {
    it('returns account ID when found', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ value: [{ accountid: 'account-789' }] })
        })
      )

      const result = await lookupAccountIdBySbi('sbi-101', 'token')

      expect(result).toEqual({ id: 'account-789' })
      expect(fetch).toHaveBeenCalledWith(
        "https://dataverse.example.com/accounts?$filter=rpa_sbinumber eq 'sbi-101'&$select=accountid",
        {
          headers: { Authorization: 'Bearer token' },
          signal: expect.any(AbortSignal)
        }
      )
    })

    it('returns error when account not found', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ value: [] })
        })
      )

      const result = await lookupAccountIdBySbi('sbi-101', 'token')

      expect(result).toEqual({ error: 'Account not found' })
    })
  })

  describe('timeouts', () => {
    it('passes request timeout to fetch', async () => {
      const timeoutSpy = vi.spyOn(AbortSignal, 'timeout')
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ value: [] })
        })
      )

      await lookupContactIdByCrn('crn-456', 'token')

      expect(timeoutSpy).toHaveBeenCalledWith(30000)
    })

    it('propagates timeout error', async () => {
      const timeoutError = new DOMException(
        'The operation timed out.',
        'TimeoutError'
      )
      global.fetch = vi.fn().mockRejectedValue(timeoutError)

      await expect(() =>
        lookupContactIdByCrn('crn-456', 'token')
      ).rejects.toThrow(timeoutError)
    })
  })
})
