import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

export const metadata = {
  title: 'Applications'
}

export default function ApplicationsPage() {
  return (
    <Sections srTitle="Applications">
      <LeftSection srTitle="Applications list">
        <div>Applications List</div>
      </LeftSection>
      <RightSection srTitle="Selected application">
        <div>Selected Application</div>
      </RightSection>
    </Sections>
  )
}
