'use client'

import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'
import Table from '@/components/table/Table'
import { useData } from '@/hooks/useData.js'

export default function LinkedContactsPage() {
  const { data } = useData('/api/linked-contacts')

  const columns = [
    { header: 'CRN', accessorKey: 'crn' },
    { header: 'First Name', accessorKey: 'firstName' },
    { header: 'Last Name', accessorKey: 'lastName' }
  ]

  const handleRowClick = (row) => {
    window.alert(JSON.stringify(row))
  }

  return (
    <Sections srTitle="Linked Contacts">
      <LeftSection srTitle="Contacts list">
        <Table
          data={data || []}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <div>Selected Contact</div>
      </RightSection>
    </Sections>
  )
}
