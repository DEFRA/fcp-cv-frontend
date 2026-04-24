'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { useSelectOnlyTableRowByCRN } from '@/hooks/select-only-table-row'
import { notification } from '@/components/notification/Notifications.jsx'
import { useEffect } from 'react'

export function AgreementsList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParams, unsetSearchParam } = useSearchParams()
  const sbi = searchParams.get('sbi')

  const { data, isLoading, error } = useDal(['agreements', sbi])

  useEffect(() => {
    if (!isLoading && error?.handleNotification) {
      notification.error(`Business with SBI ${sbi} not found.`)
    }
  }, [data, isLoading, sbi, error])

  useSelectOnlyTableRowByCRN(data)

  return (
    <Table
      skeletonRows={5}
      data={error ? [] : data?.list}
      columns={[
        {
          header: 'Reference',
          accessorKey: 'contractId',
          cell: (props) => (
            <span className="tabular-nums">{props.getValue()}</span>
          )
        },
        { header: 'Year', accessorKey: 'schemeYear' },
        { header: 'Agreement Name', accessorKey: 'name' },
        { header: 'Type', accessorKey: 'contractType' },
        { header: 'Start Date', accessorKey: 'startDate' },
        { header: 'End Date', accessorKey: 'endDate' },
        { header: 'Status', accessorKey: 'status' },
        {
          header: '',
          accessorKey: 'contractId',
          id: 'view',

          cell: () => (
            <span className="text-green-700 underline hover:text-green-900">
              View
            </span>
          )
        }
      ]}
      onRowClick={(row) => {
        setSearchParams({ contractId: row.contractId })
      }}
      onClearClick={() => {
        unsetSearchParam('contractId')
      }}
      selectedRow={searchParams.get('contractId')}
      selectedRowAccessorKey="contractId"
      searchBarClassName="ml-0"
      enableSorting={false}
    />
  )
}
