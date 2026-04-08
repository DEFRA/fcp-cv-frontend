import { handleApiError, partialResponse } from '@/lib/api'
import { dalRequest } from '@/lib/dal'
import { NextResponse } from 'next/server'

const query = `#graphql
  query CVLinkedContactsList($sbi: ID!) {
    business(sbi: $sbi) {
      customers {
        role
        crn
        firstName
        lastName
      }
    }
  }
`

export const runtime = 'nodejs'

function errorDescription(sbi) {
  return `Problem retrieving customers for business with SBI: ${sbi}`
}

export async function GET(req, { params }) {
  const { sbi } = await params

  try {
    const response = await dalRequest({ query, variables: { sbi } })

    const { data, errors } = response
    const customers = data?.business?.customers ?? []

    // Sort by firstName → lastName (case-insensitive)
    // Could be done in the table component if sorting is enabled
    // Table sorting is a "nice to have" at the moment though as it's not part of the current app
    // Would need to take a look into multi-column sorting in tanstack
    customers.sort((a, b) => {
      const firstA = a.firstName.toLowerCase()
      const firstB = b.firstName.toLowerCase()

      if (firstA !== firstB) {
        return firstA.localeCompare(firstB)
      }

      const lastA = a.lastName.toLowerCase()
      const lastB = b.lastName.toLowerCase()
      return lastA.localeCompare(lastB)
    })

    if (errors?.length) {
      return partialResponse(req, errors, errorDescription(sbi), customers)
    }

    return NextResponse.json(customers)
  } catch (error) {
    return handleApiError(req, error, errorDescription(sbi))
  }
}
