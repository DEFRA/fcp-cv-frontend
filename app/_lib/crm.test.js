import { describe, expect, it, vi } from 'vitest'

import { getCrmContactUrl, getCrmAccountUrl } from './crm'

vi.mock('@/config', () => ({
  config: {
    get: vi.fn((key) => {
      if (key === 'crm.baseUrl') return 'https://crm.example.com'
      if (key === 'crm.appId') return 'test-app-id'
      return undefined
    })
  }
}))

describe('CRM URL functions', () => {
  it('getCrmContactUrl creates correct URL', () => {
    const url = getCrmContactUrl('contact-123')

    expect(url).toBe(
      'https://crm.example.com/main.aspx?appid=test-app-id&pagetype=entityrecord&etn=contact&id=contact-123'
    )
  })

  it('getCrmAccountUrl creates correct URL', () => {
    const url = getCrmAccountUrl('account-456')

    expect(url).toBe(
      'https://crm.example.com/main.aspx?appid=test-app-id&pagetype=entityrecord&etn=account&id=account-456'
    )
  })
})
