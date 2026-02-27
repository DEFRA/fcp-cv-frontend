'use client'

import { useDataverse } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { useEffect } from 'react'

export function useDataverseAccountIDToSBI() {
  const { searchParams, setSearchParam } = useSearchParams()

  const typename = searchParams.get('typename')
  const id = searchParams.get('id')
  const sbi = searchParams.get('sbi')

  const { data } = useDataverse(['account', id], [typename === 'account', !sbi])

  useEffect(() => {
    if (data?.rpa_sbinumber) {
      setSearchParam('sbi', data.rpa_sbinumber)
    }
  }, [data, setSearchParam])
}

export function useDataverseContactIDToCRN() {
  const { searchParams, setSearchParam } = useSearchParams()

  const typename = searchParams.get('typename')
  const id = searchParams.get('id')
  const crn = searchParams.get('crn')

  const { data } = useDataverse(['contact', id], [typename === 'contact', !crn])

  console.log(data)

  useEffect(() => {
    if (data?.rpa_capcustomerid) {
      setSearchParam('crn', data.rpa_capcustomerid)
    }
  }, [data, setSearchParam])
}
