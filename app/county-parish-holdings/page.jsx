import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

import { CountyParishHoldingsDetails } from './county-parish-holdings-details'
import { CountyParishHoldingsList } from './county-parish-holdings-list'

export const metadata = {
  title: 'County Parish Holdings (CPH)'
}

export default function CountyParishHoldingsPage() {
  return (
    <Sections srTitle={metadata.title}>
      <LeftSection srTitle="CPH list">
        <CountyParishHoldingsList />
      </LeftSection>
      <RightSection srTitle="Selected CPH">
        <CountyParishHoldingsDetails />
      </RightSection>
    </Sections>
  )
}
