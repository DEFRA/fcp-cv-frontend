'use client'

import { useSearchParams as nextUseSearchParams } from 'next/navigation'

export function useSearchParams() {
  const searchParams = nextUseSearchParams()

  return {
    searchParams,
    setSearchParam(key, value) {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value)
      window.history.pushState(null, '', `?${params.toString()}`)
    },
    unsetSearchParam(key) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)
      window.history.pushState(null, '', `?${params.toString()}`)
    }
  }
}
