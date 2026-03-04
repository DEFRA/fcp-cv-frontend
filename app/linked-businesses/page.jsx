import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'
import { LinkedBusinessesDetails } from './linked-businesses-details'
import { LinkedBusinessesList } from './linked-businesses-list'

export const metadata = {
  title: 'Linked Businesses'
}

export default function LinkedBusinessesPage() {
  return (
    <Sections srTitle={metadata.title}>
      <LeftSection srTitle="Businesses list">
        <LinkedBusinessesList />
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <LinkedBusinessesDetails />
      </RightSection>
    </Sections>
  )
}
