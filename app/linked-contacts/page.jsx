'use client'

import { ExternalLinkButton } from '@/components/button/Button'
import { KeyValueList } from '@/components/key-value-list/KeyValueList'
import AppLink from '@/components/link/AppLink'
import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'
import Table from '@/components/table/Table'
import { useData } from '@/hooks/useData.js'

export default function LinkedContactsPage() {
  const { data = [] } = useData('/api/dal/linked-contacts-list')

  const columns = [
    { header: 'CRN', accessorKey: 'crn' },
    { header: 'First Name', accessorKey: 'firstName' },
    { header: 'Last Name', accessorKey: 'lastName' }
  ]

  const items = {
    CRN: '8562286973',
    'Full Name:': 'Ms. Kailey Bridget Olson',
    'Role:': 'Business Partner'
  }

  return (
    <Sections srTitle="Linked Contacts">
      <LeftSection srTitle="Contacts list">
        <Table data={data} columns={columns} />
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <div className="flex items-start justify-between gap-6">
          <h2 className="text-3xl font-bold">Kailey Olson</h2>
          <ExternalLinkButton href="/customer">
            View customer
          </ExternalLinkButton>
        </div>
        <div className="w-1/2">
          <KeyValueList items={items} />
        </div>
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
