'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseContactIDToCRN } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { useSelectOnlyTableRowBySBI } from '@/hooks/select-only-table-row'

export function LinkedBusinessesList() {
  useDataverseContactIDToCRN()
  const { searchParams, setSearchParams, unsetSearchParam } = useSearchParams()

  const { data } = useDal([
    'linked-businesses',
    'list',
    searchParams.get('crn')
  ])

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
