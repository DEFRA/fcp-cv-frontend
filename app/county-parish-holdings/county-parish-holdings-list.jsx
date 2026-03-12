'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'

export function CountyParishHoldingsList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParam, unsetSearchParam } = useSearchParams()

  const { data } = useDal(['county-parish-holdings', searchParams.get('sbi')])

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
        setSearchParam('cphNumber', row.cphNumber)
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
