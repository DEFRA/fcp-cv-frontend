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
import { cn } from '@/lib/utils'

const defaultAgreementSummary = [
  { dt: 'Agreement Reference' },
  { dt: 'Status' },
  { dt: 'Type' },
  { dt: 'Start Date' },
  { dt: 'Scheme Year' },
  { dt: 'End Date' }
]

export function AgreementsDetails() {
  const { searchParams, unsetSearchParam } = useSearchParams()

  const contractId = searchParams.get('contractId')

  const { data = { details: {} }, isLoading } = useDal([
    'agreements',
    searchParams.get('sbi')
  ])

  const summary = data.details[contractId]?.summary ?? defaultAgreementSummary

  return (
    <div className="space-y-6">
      <button
        className={cn([
          'text-blue-700 underline underline-offset-2 cursor-pointer',
          'hover:text-blue-900 visited:text-purple-700',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'mb-2'
        ])}
        onClick={() => unsetSearchParam('contractId')}
      >
        {'< Back to Agreements list'}
      </button>

      <KeyValueList>
        <KeyValueListTitle loading={isLoading}>
          {data.details[contractId]?.name}
        </KeyValueListTitle>
        <KeyValueListContent columns={2}>
          {summary.map((item) => (
            <KeyValueListItem key={item.dt} {...item} loading={isLoading} />
          ))}
        </KeyValueListContent>
      </KeyValueList>

      <Table
        loading={isLoading}
        data={data.details[contractId]?.paymentSchedules || Array(10).fill({})}
        columns={[
          { header: 'Sheet', accessorKey: 'sheetName' },
          { header: 'Parcel', accessorKey: 'parcelName' },
          { header: 'Description', accessorKey: 'optionDescription' },
          { header: 'Action Area (ha)', accessorKey: 'actionArea' },
          { header: 'Action Length (m)', accessorKey: 'actionMTL' },
          { header: 'Action Units', accessorKey: 'actionUnits' },
          { header: 'Parcel Area (ha)', accessorKey: 'parcelTotalArea' },
          { header: 'Payment Schedule', accessorKey: 'paymentSchedule' },
          { header: 'Commitment Term', accessorKey: 'commitmentTerm' }
        ]}
        enableSorting={false}
        searchBarClassName="ml-0"
      />
    </div>
  )
}
