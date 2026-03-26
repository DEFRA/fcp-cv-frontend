import {
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'
import { PaymentsDetails } from './payments-details'
import { PaymentsList } from './payments-list'

export const metadata = {
  title: 'Payments'
}

export default function PaymentsPage() {
  return (
    <Sections srTitle={metadata.title}>
      <LeftSection srTitle="Payments list">
        <PaymentsList />
      </LeftSection>
      <RightSection srTitle="Selected payment">
        <PaymentsDetails />
      </RightSection>
    </Sections>
  )
}
