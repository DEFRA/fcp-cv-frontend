import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

export const metadata = {
  title: 'Business Messages'
}

export default function BusinessMessagesPage() {
  return (
    <Sections srTitle={metadata.title}>
      <LeftSection srTitle="Message list">
        <div>Message List</div>
      </LeftSection>
      <RightSection srTitle="Selected message">
        <div>Selected Message</div>
      </RightSection>
    </Sections>
  )
}
