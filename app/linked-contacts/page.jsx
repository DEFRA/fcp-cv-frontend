import { KeyValueList } from '@/components/key-value-list/KeyValueList'
import AppLink from '@/components/link/AppLink'
import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'
import {
  LinkedContactsList,
  LinkedContactsListSkeleton
} from 'linked-contacts/linked-contacts-list.jsx'
import { Suspense } from 'react'

export default async function LinkedContactsPage() {
  const items = {
    CRN: '8562286973',
    'Full Name:': 'Ms. Kailey Bridget Olson',
    'Role:': 'Business Partner'
  }

  return (
    <Sections srTitle="Linked Contacts">
      <LeftSection srTitle="Contacts list">
        <Suspense fallback={<LinkedContactsListSkeleton />}>
          <LinkedContactsList />
        </Suspense>
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <KeyValueList title="Kailey Olson" items={items} />
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
