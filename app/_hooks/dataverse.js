'use client'

import { useDataverse } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { useEffect } from 'react'

function useDataverseIDToParam(entity, key) {
  const { searchParams, setSearchParams } = useSearchParams()

  const id = searchParams.get('id')
  const currentValue = searchParams.get(key)

  const { data } = useDataverse([entity, id], [!currentValue])

  useEffect(() => {
    const value = data?.[key]
    if (value) {
      setSearchParams({ [key]: value })
    }
  }, [data, key, setSearchParams])
}

export function useDataverseAccountIDToSBI() {
  useDataverseIDToParam('account', 'sbi')
}

export function useDataverseContactIDToCRN() {
  useDataverseIDToParam('contact', 'crn')
}
