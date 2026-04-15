'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { useSelectOnlyTableRowByCRN } from '@/hooks/select-only-table-row'
import { useEffect } from 'react'
import { notification } from '@/components/notification/Notifications.jsx'

export function LinkedContactsList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParams, unsetSearchParam } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const { data, isLoading } = useDal(['linked-contacts', 'list', sbi])

  useEffect(() => {
    // console.log('Data: ' + JSON.stringify(data))
    // console.log(isLoading)

    if (!isLoading && sbi && !data) {
      notification.error(`No linked contacts found for SBI ${sbi}.`)
    }
  }, [data, isLoading, sbi])

  useSelectOnlyTableRowByCRN(data)

  return (
    <Table
      data={data}
      columns={[
        {
          header: 'CRN',
          accessorKey: 'crn',
          cell: (props) => (
            <span className="tabular-nums">{props.getValue()}</span>
          )
        },
        { header: 'First Name', accessorKey: 'firstName' },
        { header: 'Last Name', accessorKey: 'lastName' },
        { header: 'Role', accessorKey: 'role' }
      ]}
      onRowClick={(row) => {
        setSearchParams({ crn: row.crn })
      }}
      onClearClick={() => {
        unsetSearchParam('crn')
      }}
      enableSorting={false}
      selectedRow={searchParams.get('crn')}
      selectedRowAccessorKey="crn"
    />
  )
}
