'use client'

import { Button } from '@/components/button/Button'
import { KeyValueList } from '@/components/key-value-list/KeyValueList'
import { useSearchParams } from '@/hooks/search-params'
import { useDal } from '@/hooks/use-dal'
import { LinkedContactsAuthenticateQuestions } from 'linked-contacts/linked-contacts-authenticate-questions'

export function LinkedContactsDetails() {
  const { searchParams } = useSearchParams()

  const { data } = useDal([
    'linked-contacts',
    'details',
    searchParams.get('sbi'),
    searchParams.get('crn')
  ])

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <h2 className="text-3xl font-bold">{data?.displayName}</h2>
        <Button href="/customer">View customer</Button>
      </div>
      <div className="grid grid-flow-row gap-5">
        <div className="w-3/4">
          <KeyValueList
            title={'Customer details'}
            items={data?.customerDetails || {}}
          />
        </div>
        <LinkedContactsAuthenticateQuestions key={searchParams.get('crn')} />
        <div className="w-3/4">
          <KeyValueList title={'Permissions'} items={data?.permissions || {}} />
        </div>
      </div>
    </>
  )
}
