'use client'

import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'

const defaultDetails = [{ dt: 'SBI' }, { dt: 'Role' }]

const defaultPermissions = [
  { dt: 'Basic Payment Scheme' },
  { dt: 'Business Details' },
  { dt: 'Countryside Stewardship Agreements' },
  { dt: 'Countryside Stewardship Applications' },
  { dt: 'Entitlements' },
  { dt: 'Environmental Land Management Applications' },
  { dt: 'Land Details' }
]

export function LinkedBusinessesDetails() {
  const { searchParams } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const crn = searchParams.get('crn')

  const { data, dalLoading } = useDal([
    'linked-businesses',
    'details',
    crn,
    sbi
  ])

  if (!sbi) {
    return (
      <div className="m-20 text-2xl font-semibold text-center text-gray-500">
        Select a contact from the table
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <KeyValueList>
        <KeyValueListTitle loading={dalLoading}>{data?.name}</KeyValueListTitle>
        <KeyValueListContent>
          {(data?.details || defaultDetails).map((item) => (
            <KeyValueListItem loading={dalLoading} key={item.dt} {...item} />
          ))}
        </KeyValueListContent>
      </KeyValueList>

      <KeyValueList>
        <KeyValueListTitle>Permissions</KeyValueListTitle>
        <KeyValueListContent>
          {(data?.permissions || defaultPermissions).map(
            ({ dt, dd, expand = [] }) => (
              <KeyValueListItem
                loading={dalLoading}
                key={`${sbi}_${dt}`}
                dt={dt}
                dd={dd}
              >
                <ul className="space-y-1 mb-5 list-disc">
                  {expand.map((item) => (
                    <li key={item} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </KeyValueListItem>
            )
          )}
        </KeyValueListContent>
      </KeyValueList>
    </div>
  )
}
