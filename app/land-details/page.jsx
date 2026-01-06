import {
  FullWidthSection,
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

export const metadata = {
  title: 'Land Details'
}

export default function LandDetailsPage() {
  return (
    <Sections srTitle={metadata.title}>
      <FullWidthSection srTitle="Land summary">
        <div>Land Summary</div>
      </FullWidthSection>
      <LeftSection srTitle="Parcels">
        <div>Parcels</div>
      </LeftSection>
      <RightSection srTitle="Selected parcel">
        <div>Selected Parcel</div>
      </RightSection>
    </Sections>
  )
}
