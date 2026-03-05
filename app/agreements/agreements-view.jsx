'use client'

import { useSearchParams } from '@/hooks/search-params'

import { AgreementsDetails } from './agreements-details'
import { AgreementsList } from './agreements-list'

export function AgreementsView() {
  const { searchParams } = useSearchParams()

  if (searchParams.get('contractId')) {
    return <AgreementsDetails />
  }

  return <AgreementsList />
}
