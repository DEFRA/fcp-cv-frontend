import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

import { BusinessMessagesDetails } from './business-messages-details'
import { BusinessMessagesList } from './business-messages-list'

export const metadata = {
  title: 'Consolidated View | Business Messages'
}

export default function BusinessMessagesPage() {
  return (
    <Sections srTitle="Business Messages">
      <LeftSection srTitle="Message list">
        <BusinessMessagesList />
      </LeftSection>
      <RightSection srTitle="Selected message">
        <BusinessMessagesDetails />
      </RightSection>
    </Sections>
  )
}
