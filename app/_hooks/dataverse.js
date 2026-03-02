'use client'

import { useDataverse } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { useEffect } from 'react'

function useDataverseIDToParam(entity, key) {
  const { searchParams, setSearchParam } = useSearchParams()

  const typename = searchParams.get('typename')
  const id = searchParams.get('id')
  const currentValue = searchParams.get(key)

  const { data } = useDataverse([entity, id], [!currentValue])

  useEffect(() => {
    const value = data?.[key]
    if (value) {
      setSearchParam(key, value)
    }
  }, [data, key, setSearchParam])
}

export function useDataverseAccountIDToSBI() {
  useDataverseIDToParam('account', 'sbi')
}

export function useDataverseContactIDToCRN() {
  useDataverseIDToParam('contact', 'crn')
}
