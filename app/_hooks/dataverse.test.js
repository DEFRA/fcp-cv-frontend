import { renderHook } from 'vitest-browser-react'

import { useDataverse } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { expect, vi } from 'vitest'

describe('Dataverse Hook Test', () => {
  beforeAll(() => {
    vi.mock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams()
    }))
    vi.mock('@/hooks/data', () => ({
      useDataverse: vi.fn()
    }))
  })

  it('renders the RootLayout component with children', async () => {
    useDataverse.mockReturnValue({ data: {} })
    await renderHook(useDataverseAccountIDToSBI)
    expect(new URLSearchParams(window.location.search).get('sbi')).toBe(null)
  })

  it('renders the RootLayout component with children', async () => {
    useDataverse.mockReturnValue({ data: { rpa_sbinumber: 'sbiValue' } })
    await renderHook(useDataverseAccountIDToSBI)
    expect(new URLSearchParams(window.location.search).get('sbi')).toBe(
      'sbiValue'
    )
  })
})
