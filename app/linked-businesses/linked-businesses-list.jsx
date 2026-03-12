'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseContactIDToCRN } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'

export function LinkedBusinessesList() {
  useDataverseContactIDToCRN()
  const { searchParams, setSearchParam, unsetSearchParam } = useSearchParams()

  const { data } = useDal([
    'linked-businesses',
    'list',
    searchParams.get('crn')
  ])

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
        setSearchParam('sbi', row.sbi)
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
