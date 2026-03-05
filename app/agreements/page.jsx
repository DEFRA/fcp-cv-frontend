import { FullWidthSection, Sections } from '@/components/sections/sections'

import { AgreementsView } from './agreements-view'

export const metadata = {
  title: 'Agreements'
}

export default function AgreementsPage() {
  return (
    <Sections srTitle={metadata.title}>
      <FullWidthSection srTitle="Agreements list">
        <AgreementsView />
      </FullWidthSection>
    </Sections>
  )
}
