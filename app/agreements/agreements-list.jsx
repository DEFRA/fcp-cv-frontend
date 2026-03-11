'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'

export function AgreementsList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParam, unsetSearchParam } = useSearchParams()

  const { data = { list: Array(10).fill({}), details: {} }, isLoading } =
    useDal(['agreements', searchParams.get('sbi')])

  return (
    <Table
      loading={isLoading}
      data={data?.list}
      columns={[
        {
          header: 'Reference',
          accessorKey: 'contractId',
          cell: (props) => (
            <span className="tabular-nums">{props.getValue()}</span>
          )
        },
        { header: 'Year', accessorKey: 'schemeYear' },
        { header: 'Agreement Name', accessorKey: 'name' },
        { header: 'Type', accessorKey: 'contractType' },
        { header: 'Start Date', accessorKey: 'startDate' },
        { header: 'End Date', accessorKey: 'endDate' },
        { header: 'Status', accessorKey: 'status' }
      ]}
      onRowClick={(row) => {
        setSearchParam('contractId', row.contractId)
      }}
      onClearClick={() => {
        unsetSearchParam('contractId')
      }}
      enableSorting={false}
      selectedRow={searchParams.get('contractId')}
      selectedRowAccessorKey="contractId"
      searchBarClassName="ml-0"
    />
  )
}
