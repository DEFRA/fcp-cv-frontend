'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseContactIDToCRN } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { useSelectOnlyTableRowBySBI } from '@/hooks/select-only-table-row'
import { useEffect } from 'react'
import { notification } from '@/components/notification/Notifications.jsx'

export function LinkedBusinessesList() {
  useDataverseContactIDToCRN()
  const { searchParams, setSearchParams, unsetSearchParam } = useSearchParams()
  const crn = searchParams.get('crn')
  const { data, isLoading } = useDal(['linked-businesses', 'list', crn])

  useEffect(() => {
    if (!isLoading && crn && !data) {
      notification.error(`No linked businesses found for CRN ${crn}.`)
    }
  }, [data, isLoading, crn])

  useSelectOnlyTableRowBySBI(data)

  return (
    <Table
      data={data}
      columns={[
        {
          header: 'SBI',
          accessorKey: 'sbi',
          cell: (props) => (
            <span className="tabular-nums">{props.getValue()}</span>
          )
        },
        { header: 'Name', accessorKey: 'name' }
      ]}
      onRowClick={(row) => {
        setSearchParams({ sbi: row.sbi })
      }}
      onClearClick={() => {
        unsetSearchParam('sbi')
      }}
      enableSorting={false}
      selectedRow={searchParams.get('sbi')}
      selectedRowAccessorKey="sbi"
    />
  )
}
