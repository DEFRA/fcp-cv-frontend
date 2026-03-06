'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'

export function ApplicationsList() {
  const { dataverseLoading } = useDataverseAccountIDToSBI()

  const { searchParams, setSearchParam, unsetSearchParam } = useSearchParams()

  const { data = { list: [], detail: {} }, dalLoading } = useDal([
    'applications',
    searchParams.get('sbi')
  ])

  return (
    <Table
      loading={dataverseLoading || dalLoading}
      data={data.list}
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
        }
      ]}
      onRowClick={(row) => {
        setSearchParam('applicationId', row.id)
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
