import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

import { ApplicationsDetails } from './applications-details'
import { ApplicationsList } from './applications-list'

export const metadata = {
  title: 'Applications'
}

export default function ApplicationsPage() {
  return (
    <Sections srTitle={metadata.title}>
      <LeftSection srTitle="Applications list">
        <ApplicationsList />
      </LeftSection>
      <RightSection srTitle="Selected application">
        <ApplicationsDetails />
      </RightSection>
    </Sections>
  )
}
