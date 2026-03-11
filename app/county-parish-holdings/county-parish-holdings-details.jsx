'use client'

import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'

const defaultItems = [
  { dt: 'Parish' },
  { dt: 'Start Date' },
  { dt: 'End Date' },
  { dt: 'Coordinates (x, y)' },
  { dt: 'Species' },
  { dt: 'Address' }
]

export function CountyParishHoldingsDetails() {
  const { searchParams } = useSearchParams()

  const cphNumber = searchParams.get('cphNumber')

  const { data = [], isLoading } = useDal([
    'county-parish-holdings',
    searchParams.get('sbi')
  ])

  if (!cphNumber) {
    return (
      <div className="m-20 text-2xl font-semibold text-center text-gray-500">
        Select an item from the table
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <KeyValueList>
        <KeyValueListTitle>CPH Number: {cphNumber}</KeyValueListTitle>
        <KeyValueListContent>
          {(data?.details?.[cphNumber] || defaultItems).map((item) => (
            <KeyValueListItem key={item.dt} {...item} loading={isLoading} />
          ))}
        </KeyValueListContent>
      </KeyValueList>
    </div>
  )
}
