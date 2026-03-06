'use client'

import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'
import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'

const defaultApplicationSummary = [
  { dt: 'Application ID' },
  { dt: 'Scheme' },
  { dt: 'Year' },
  { dt: 'Status' },
  { dt: 'Status (Portal)' },
  { dt: 'Submitted Date' },
  { dt: 'Agreement References' },
  { dt: 'Last Movement' },
  { dt: 'Last Movement Date/Time' }
]

export function ApplicationsDetails() {
  const { searchParams } = useSearchParams()

  const applicationId = searchParams.get('applicationId')

  const { data = [], dalLoading } = useDal([
    'applications',
    searchParams.get('sbi')
  ])

  if (!applicationId) {
    return (
      <div className="m-20 text-2xl font-semibold text-center text-gray-500">
        Select an item from the table
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <KeyValueList>
        <KeyValueListTitle loading={dalLoading}>
          {data?.details?.[applicationId]?.name}
        </KeyValueListTitle>
        <KeyValueListContent>
          {(
            data?.details?.[applicationId]?.summary || defaultApplicationSummary
          ).map((item) => (
            <KeyValueListItem key={item.dt} {...item} loading={dalLoading} />
          ))}
        </KeyValueListContent>
      </KeyValueList>

      <h2 className="text-xl font-bold">Movement History</h2>
      <Table
        enableSearching={false}
        data={data?.details?.[applicationId]?.movementHistory || []}
        columns={[
          {
            header: 'Date/Time',
            accessorKey: 'id',
            cell: (props) => (
              <span className="tabular-nums">{props.getValue()}</span>
            )
          },
          { header: 'Movement', accessorKey: 'name' },
          {
            header: 'Check',
            accessorKey: 'checkStatus'
          }
        ]}
        enableSorting={false}
      />
    </div>
  )
}
