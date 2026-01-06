import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

export const metadata = {
  title: 'Linked Contacts'
}

export default function LinkedContactsPage() {
  return (
    <Sections srTitle={metadata.title}>
      <LeftSection srTitle="Contacts list">
        <div>Contacts List</div>
      </LeftSection>
      <RightSection srTitle="Selected contact">
        <div>Selected Contact</div>
      </RightSection>
    </Sections>
  )
}
