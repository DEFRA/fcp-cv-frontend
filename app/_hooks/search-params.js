'use client'

import { useSearchParams as nextUseSearchParams } from 'next/navigation'

export function useSearchParams() {
  const searchParams = nextUseSearchParams()

  return {
    searchParams: searchParams || new URLSearchParams(),
    setSearchParams(entries) {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(entries)) {
        const _value = `${value}`
        if (_value && _value !== 'undefined' && _value !== 'null') {
          params.set(key, _value)
        }
      }
      window.history.pushState(null, '', `?${params.toString()}`)
    },
    unsetSearchParam(key) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)
      window.history.pushState(null, '', `?${params.toString()}`)
    }
  }
}
