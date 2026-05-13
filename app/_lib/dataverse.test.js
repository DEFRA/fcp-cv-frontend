import { describe, expect, it, vi } from 'vitest'

import { lookupContactIdByCrn, lookupAccountIdBySbi } from './dataverse'

vi.mock('@/config', () => ({
  config: {
    get: vi.fn((key) => {
      switch (key) {
        case 'crm.baseUrl':
          return 'https://dataverse.example.com'
        case 'crm.dataversePath':
          return 'api/data/v9.2'

        default:
          return 'missing config'
      }
    })
  }
}))

describe('Dataverse lookup functions', () => {
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
        "https://dataverse.example.com/api/data/v9.2/contacts?$filter=rpa_capcustomerid eq 'crn-456'&$select=contactid",
        {
          headers: { Authorization: 'Bearer token' }
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
        "https://dataverse.example.com/api/data/v9.2/accounts?$filter=rpa_sbinumber eq 'sbi-101'&$select=accountid",
        {
          headers: { Authorization: 'Bearer token' }
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
})
