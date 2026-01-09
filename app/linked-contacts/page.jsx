'use client'

import { KeyValueList } from '@/components/key-value-list/KeyValueList'
import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'
import Table from '@/components/table/Table'

export default function LinkedContactsPage() {
  const data = [
    { firstName: 'Merl', lastName: 'Kemmer', crn: '1103020285' },
    { firstName: 'Kailey', lastName: 'Olson', crn: '8562286973' },
    { firstName: 'Yolanda', lastName: 'Sawayn-Cummerata', crn: '1638563942' },
    { firstName: 'Zetta', lastName: 'Hayes-Witting', crn: '3170633316' },
    { firstName: 'Nona', lastName: 'Ward', crn: '1343571956' }
  ]

  const columns = [
    { header: 'CRN', accessorKey: 'crn' },
    { header: 'First Name', accessorKey: 'firstName' },
    { header: 'Last Name', accessorKey: 'lastName' }
  ]

  const handleRowClick = (row) => {
    window.alert(JSON.stringify(row))
  }

  const items = {
    'CRN:': '8562286973',
    'Full Name:': 'Ms. Kailey Bridget Olson',
    'Role:': 'Business Partner'
  }

  return (
    <Sections srTitle="Linked Contacts">
      <LeftSection srTitle="Contacts list">
        <Table data={data} columns={columns} onRowClick={handleRowClick} />
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <KeyValueList title="Kailey Olson" items={items} />
      </RightSection>
    </Sections>
  )
}
