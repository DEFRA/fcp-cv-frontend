import { FullWidthSection, Sections } from '@/components/sections/sections'

export const metadata = {
  title: 'Agreements'
}

export default function AgreementsPage() {
  return (
    <Sections srTitle={metadata.title}>
      <FullWidthSection srTitle="Agreements list">
        <div>Agreements</div>
      </FullWidthSection>
    </Sections>
  )
}
