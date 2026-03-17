import {
  FullWidthSection,
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

import { LandParcelDetails } from './land-parcel-details'
import { LandParcelsList } from './land-parcels-list'
import { LandSummary } from './land-summary'

export const metadata = {
  title: 'Land Details'
}

export default function LandDetailsPage() {
  return (
    <Sections srTitle={metadata.title}>
      <FullWidthSection srTitle="Land summary">
        <LandSummary />
      </FullWidthSection>
      <LeftSection srTitle="Parcels">
        <LandParcelsList />
      </LeftSection>
      <RightSection srTitle="Selected parcel">
        <LandParcelDetails />
      </RightSection>
    </Sections>
  )
}
