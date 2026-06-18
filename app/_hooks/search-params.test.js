import { renderHook } from 'vitest-browser-react'

import { useSearchParams } from '@/hooks/search-params'
import { useSearchParams as nextUseSearchParams } from 'next/navigation'
import { expect } from 'vitest'

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn()
}))

describe('Search Params Hook Test', () => {
  beforeEach(() => {
    nextUseSearchParams.mockReturnValue(new URLSearchParams())
  })

  describe('#setSearchParams', () => {
    it.each([12345, 0, 1, false, true, 'string', '02/01/2027'])(
      `Should allow "%s" in query string`,
      async (value) => {
        const { result } = await renderHook(useSearchParams)
        result.current.setSearchParams({ searchParam: value })
        expect(window.location.search).toBe(
          `?searchParam=${encodeURIComponent(value)}`
        )
      }
    )

    it.each([null, undefined, 'undefined', 'null', ''])(
      `Should not allow "%s" in query string`,
      async (value) => {
        const { result } = await renderHook(useSearchParams)
        result.current.setSearchParams({
          searchParam: encodeURIComponent(value)
        })
        expect(window.location.search).not.contain(`searchParam`)
      }
    )
  })

  describe('#unsetSearchParam', () => {
    it('renders the RootLayout component with children', async () => {
      const { result } = await renderHook(useSearchParams)
      result.current.setSearchParams({
        crn: encodeURIComponent('crn')
      })
      expect(window.location.search).toBe('?crn=crn')
      result.current.unsetSearchParam('crn')
      expect(window.location.search).toBe('')
    })
  })
})
