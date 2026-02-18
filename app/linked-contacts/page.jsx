import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

import { LinkedContactsDetails } from 'linked-contacts/linked-contacts-details'
import { LinkedContactsList } from 'linked-contacts/linked-contacts-list'

export const metadata = {
  title: 'Consolidated View | Linked Contacts'
}

export default function LinkedContactsPage() {
  return (
    <Sections srTitle="Linked Contacts">
      <LeftSection srTitle="Contacts list">
        <LinkedContactsList />
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <LinkedContactsDetails />
      </RightSection>
    </Sections>
  )
}
