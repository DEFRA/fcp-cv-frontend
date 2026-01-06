import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

export const metadata = {
  title: 'County Parish Holdings (CPH)'
}

export default function CountyParishHoldingsPages() {
  return (
    <Sections srTitle={metadata.title}>
      <LeftSection srTitle="CPH list">
        <div>CPH List</div>
      </LeftSection>
      <RightSection srTitle="Selected CPH">
        <div>Selected CPH</div>
      </RightSection>
    </Sections>
  )
}
