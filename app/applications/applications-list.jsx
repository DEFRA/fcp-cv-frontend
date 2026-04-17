'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { useSelectOnlyTableRowByCRN } from '@/hooks/select-only-table-row'
import { useEffect } from 'react'
import { notification } from '@/components/notification/Notifications.jsx'

export function ApplicationsList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParams, unsetSearchParam } = useSearchParams()
  const sbi = searchParams.get('sbi')

  const { data, isLoading, error } = useDal(['applications', sbi])

  useEffect(() => {
    if (!isLoading && error && !error.notificationHandled) {
      notification.error(`Business with SBI ${sbi} not found.`)
    }
  }, [data, isLoading, sbi, error])

  useSelectOnlyTableRowByCRN(data)

  return (
    <Table
      skeletonRows={5}
      data={data?.list}
      columns={[
        {
          header: 'Application ID',
          accessorKey: 'id',
          cell: (props) => (
            <span className="tabular-nums">{props.getValue()}</span>
          )
        },
        { header: 'Year', accessorKey: 'year' },
        {
          header: 'Application Name',
          accessorKey: 'name'
        },
        {
          header: 'Status',
          accessorKey: 'status'
        },
        {
          accessorKey: 'scheme'
        },
        {
          accessorKey: 'agreementReferences'
        }
      ]}
      columnVisibility={{ scheme: false, agreementReferences: false }}
      onRowClick={(row) => {
        setSearchParams({ applicationId: row.id })
      }}
      onClearClick={() => {
        unsetSearchParam('applicationId')
      }}
      enableSorting={false}
      selectedRow={searchParams.get('applicationId')}
      selectedRowAccessorKey="id"
    />
  )
}
