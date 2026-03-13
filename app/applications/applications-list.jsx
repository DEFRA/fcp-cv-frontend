'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'

export function ApplicationsList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParams, unsetSearchParam } = useSearchParams()

  const { data } = useDal(['applications', searchParams.get('sbi')])

  return (
    <Table
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
        }
      ]}
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
