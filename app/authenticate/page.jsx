import { FullWidthSection, Sections } from '@/components/sections/sections'

export const metadata = {
  title: 'Authenticate'
}

export default function AuthenticatePage() {
  return (
    <Sections srTitle={metadata.title}>
      <FullWidthSection srTitle="Memorable questions">
        <div>Authenticate</div>
      </FullWidthSection>
    </Sections>
  )
}
