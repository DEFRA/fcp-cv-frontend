'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { useSelectOnlyTableRowByCRN } from '@/hooks/select-only-table-row'
import { useEffect } from 'react'
import { notification } from '@/components/notification/Notifications.jsx'

export function CountyParishHoldingsList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParams, unsetSearchParam } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const { data, isLoading } = useDal(['county-parish-holdings', sbi])

  // TODO
  console.log('LIST: ' + JSON.stringify(data))
  console.log('LIST: ' + isLoading)

  useEffect(() => {
    if (!isLoading && sbi && Object.keys(data?.list ?? {}).length === 0) {
      notification.error(
        `No county parish holdings found for business with SBI ${sbi}.`
      )
    }
  }, [data, isLoading, sbi])

  useSelectOnlyTableRowByCRN(data)

  return (
    <Table
      data={data?.list}
      columns={[
        {
          header: 'CPH Number',
          accessorKey: 'cphNumber',
          cell: (props) => (
            <span className="tabular-nums">{props.getValue()}</span>
          )
        },
        { header: 'Parish', accessorKey: 'parish' },
        {
          header: 'Start Date',
          accessorKey: 'startDate'
        },
        {
          header: 'End Date',
          accessorKey: 'endDate'
        },
        {
          header: 'Species',
          accessorKey: 'species'
        },
        {
          header: 'Address',
          accessorKey: 'address'
        }
      ]}
      columnVisibility={{
        species: false,
        address: false
      }}
      onRowClick={(row) => {
        setSearchParams({ cphNumber: row.cphNumber })
      }}
      onClearClick={() => {
        unsetSearchParam('cphNumber')
      }}
      enableSorting={false}
      selectedRow={searchParams.get('cphNumber')}
      selectedRowAccessorKey="cphNumber"
    />
  )
}
