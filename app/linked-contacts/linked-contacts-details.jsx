'use client'

import { LinkButton } from '@/components/button/Button'
import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { LinkedContactsAuthenticateQuestions } from './linked-contacts-authenticate-questions'

const defaultDetails = [{ dt: 'CRN' }, { dt: 'Full Name' }, { dt: 'Role' }]

const defaultPermissions = [
  { dt: 'Basic Payment Scheme' },
  { dt: 'Business Details' },
  { dt: 'Countryside Stewardship Agreements' },
  { dt: 'Countryside Stewardship Applications' },
  { dt: 'Entitlements' },
  { dt: 'Environmental Land Management Applications' },
  { dt: 'Land Details' }
]

export function LinkedContactsDetails() {
  const { searchParams } = useSearchParams()

  const crn = searchParams.get('crn')

  const { data, isLoading } = useDal(
    ['linked-contacts', 'details', searchParams.get('sbi'), crn],
    []
  )

  if (!crn) {
    return (
      <div className="m-20 text-2xl font-semibold text-center text-gray-500">
        Select a contact from the table
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-4">
          <KeyValueList>
            <KeyValueListTitle loading={isLoading}>
              {data?.displayName}
            </KeyValueListTitle>
            <KeyValueListContent>
              {(data?.details || defaultDetails).map((item) => (
                <KeyValueListItem loading={isLoading} key={item.dt} {...item} />
              ))}
            </KeyValueListContent>
          </KeyValueList>
        </div>

        <LinkButton href="/#">View Contact</LinkButton>
      </div>

      <LinkedContactsAuthenticateQuestions key={crn} />

      <KeyValueList>
        <KeyValueListTitle>Permissions</KeyValueListTitle>
        <KeyValueListContent>
          {(data?.permissions || defaultPermissions).map(
            ({ dt, dd, expand = [] }) => (
              <KeyValueListItem
                loading={isLoading}
                key={`${crn}_${dt}`}
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
