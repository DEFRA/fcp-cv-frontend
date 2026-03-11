import { renderHook } from 'vitest-browser-react'

import { useSearchParams } from '@/hooks/search-params'
import { expect } from 'vitest'

describe('Search Params Hook Test', () => {
  beforeAll(() => {
    vi.mock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams()
    }))
  })

  it('renders the RootLayout component with children', async () => {
    const { result } = await renderHook(useSearchParams)
    result.current.setSearchParams({ crn: 'crn' })
    expect(window.location.search).toBe('?crn=crn')
  })

  it('renders the RootLayout component with children', async () => {
    const { result } = await renderHook(useSearchParams)
    expect(window.location.search).toBe('?crn=crn')
    result.current.unsetSearchParam('crn')
    expect(window.location.search).toBe('')
  })
})
