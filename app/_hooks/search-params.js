'use client'

import * as navigation from 'next/navigation'

export function useSearchParams() {
  const searchParams = navigation.useSearchParams()

  return {
    searchParams,
    setSearchParam(key, value) {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value)
      window.history.pushState(null, '', `?${params.toString()}`)
    }
  }
}
