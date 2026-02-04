'use client'

import Table from '@/components/table/Table'
import { useSearchParams } from '@/hooks/search-params'
import { useDal } from '@/hooks/use-dal'

export function LinkedContactsList() {
  const { searchParams, setSearchParam } = useSearchParams()

  const { data = [] } = useDal([
    'linked-contacts',
    'list',
    searchParams.get('sbi')
  ])

  const columns = [
    { header: 'CRN', accessorKey: 'crn' },
    { header: 'First Name', accessorKey: 'firstName' },
    { header: 'Last Name', accessorKey: 'lastName' }
  ]

  return (
    <Table
      data={data}
      columns={columns}
      onRowClick={(row) => {
        setSearchParam('crn', row.crn)
      }}
    />
  )
}
