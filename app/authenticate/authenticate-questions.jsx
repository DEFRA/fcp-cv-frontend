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
import { notification } from '@/components/notification/Notifications.jsx'

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

  const { data, isLoading, error } = useDal(['authenticate', crn])

  useEffect(() => {
    if (!isLoading && error && !error.notificationHandled) {
      if (!error.notificationHandled) {
        notification.error(`Contact with CRN ${crn} not found.`)
      }
    }
  }, [data, isLoading, crn, error])

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
