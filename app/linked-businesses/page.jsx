import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

export const metadata = {
  title: 'Linked Businesses'
}

export default function LinkedBusinessesPage() {
  return (
    <Sections srTitle={metadata.title}>
      <LeftSection srTitle="Businesses list">
        <div>Businesses List</div>
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <div>Selected Contact</div>
      </RightSection>
    </Sections>
  )
}
