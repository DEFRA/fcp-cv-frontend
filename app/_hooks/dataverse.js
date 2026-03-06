'use client'

import { useDataverse } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { useEffect } from 'react'

function useDataverseIDToParam(entity, key) {
  const { searchParams, setSearchParam } = useSearchParams()

  const id = searchParams.get('id')
  const currentValue = searchParams.get(key)

  const { data, isLoading } = useDataverse([entity, id], [!currentValue])

  useEffect(() => {
    const value = data?.[key]
    if (value) {
      setSearchParam(key, value)
    }
  }, [data, key, setSearchParam])

  return { dataverseLoading: isLoading }
}

export function useDataverseAccountIDToSBI() {
  return useDataverseIDToParam('account', 'sbi')
}

export function useDataverseContactIDToCRN() {
  return useDataverseIDToParam('contact', 'crn')
}
