'use client'

import { Button } from '@/components/button/Button'
import { KeyValueList } from '@/components/key-value-list/KeyValueList'
import AppLink from '@/components/link/AppLink'
import { notification } from '@/components/notification/Notifications'
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
    const random = Math.random()
    if (random < 0.3) {
      notification.error(
        `Error: Selected contact: ${row.firstName} ${row.lastName} (${row.crn})`
      )
    } else if (random < 0.6) {
      notification.warning(
        `Warning: Selected contact: ${row.firstName} ${row.lastName} (${row.crn})`
      )
    } else {
      notification.info(
        `Info: Selected contact: ${row.firstName} ${row.lastName} (${row.crn})`
      )
    }
  }

  const items = {
    CRN: '8562286973',
    'Full Name:': 'Ms. Kailey Bridget Olson',
    'Role:': 'Business Partner'
  }

  return (
    <Sections srTitle="Linked Contacts">
      <LeftSection srTitle="Contacts list">
        <Table data={data} columns={columns} onRowClick={handleRowClick} />
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <div className="flex items-start justify-between gap-6">
          <h2 className="text-3xl font-bold">Kailey Olson</h2>
          <Button href="/customer">View customer</Button>
        </div>
        <div className="w-1/2">
          <KeyValueList items={items} />
        </div>
        {/* <div>Selected Contact</div> */}
        <div className="flex justify-end">
          <AppLink
            text="View Authenticate Questions"
            location="/authenticate"
          />
        </div>
      </RightSection>
    </Sections>
  )
}
