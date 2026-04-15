'use client'

import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem
} from '@/components/key-value-list-v2/key-value-list'
import { useDal } from '@/hooks/data'
import { useDataverseContactIDToCRN } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { useEffect } from 'react'

const defaultItems = [
  { dt: 'Memorable Date' },
  { dt: 'Memorable Location' },
  { dt: 'Memorable Event' },
  { dt: 'Updated At' }
]

export function AuthenticateQuestions() {
  useDataverseContactIDToCRN()

  const { searchParams } = useSearchParams()
  const crn = searchParams.get('crn')

  const { data, isLoading } = useDal(['authenticate', crn])

  // TODO - Data is all coming back with "Not set" - that's not ideal, needs a different handling pattern
  useEffect(() => {
    if (isLoading === false && Object.keys(data?.details ?? {}).length === 0) {
      // notification.error(`No authentication questions found for customer with CRN ${crn}.`)
    }
  }, [data, isLoading, crn])

  return (
    <KeyValueList>
      <KeyValueListContent>
        {(data || defaultItems).map((item) => (
          <KeyValueListItem key={item.dt} loading={isLoading} {...item} />
        ))}
      </KeyValueListContent>
    </KeyValueList>
  )
}
