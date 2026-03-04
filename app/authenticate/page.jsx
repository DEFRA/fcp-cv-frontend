import { FullWidthSection, Sections } from '@/components/sections/sections'

import { AuthenticateQuestions } from './authenticate-questions'

export const metadata = {
  title: 'Authenticate'
}

export default function AuthenticatePage() {
  return (
    <Sections srTitle={metadata.title}>
      <FullWidthSection srTitle="Memorable questions">
        <AuthenticateQuestions />
      </FullWidthSection>
    </Sections>
  )
}
