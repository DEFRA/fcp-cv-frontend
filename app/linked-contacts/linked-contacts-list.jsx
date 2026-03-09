'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'

export function LinkedContactsList() {
  const { dataverseLoading } = useDataverseAccountIDToSBI()

  const { searchParams, setSearchParam, unsetSearchParam } = useSearchParams()

  const { data = [], dalLoading } = useDal([
    'linked-contacts',
    'list',
    searchParams.get('sbi')
  ])

  return (
    <Table
      loading={dataverseLoading || dalLoading}
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
        setSearchParam('crn', row.crn)
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
