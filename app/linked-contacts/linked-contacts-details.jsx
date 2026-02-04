'use client'

import { Button } from '@/components/button/Button'
import { KeyValueList } from '@/components/key-value-list/KeyValueList'
import AppLink from '@/components/link/AppLink'
import { useSearchParams } from '@/hooks/search-params'
import { useDal } from '@/hooks/use-dal'

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
      <div className="w-1/2">
        <KeyValueList items={data?.items || {}} />
      </div>
      {/* <div>Selected Contact</div> */}
      <div className="flex justify-end">
        <AppLink text="View Authenticate Questions" location="/authenticate" />
      </div>
    </>
  )
}
