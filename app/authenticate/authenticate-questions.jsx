'use client'

import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem
} from '@/components/key-value-list-v2/key-value-list'
import { useDal } from '@/hooks/data'
import { useDataverseContactIDToCRN } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'

const defaultItems = [
  { dt: 'Memorable Date' },
  { dt: 'Memorable Location' },
  { dt: 'Memorable Event' },
  { dt: 'Updated at' }
]

export function AuthenticateQuestions() {
  useDataverseContactIDToCRN()

  const { searchParams } = useSearchParams()
  const crn = searchParams.get('crn')

  const { data, isLoading } = useDal(['authenticate', crn])

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
