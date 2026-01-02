import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

export const metadata = {
  title: 'County Parish Holdings'
}

export default function CountyParishHoldingsPages() {
  return (
    <Sections srTitle="County Parish Holdings (CPH)">
      <LeftSection srTitle="CPH list">
        <div>CPH List</div>
      </LeftSection>
      <RightSection srTitle="Selected CPH">
        <div>Selected CPH</div>
      </RightSection>
    </Sections>
  )
}
