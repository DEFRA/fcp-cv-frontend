import { NextResponse } from 'next/server'

import { dalRequest } from '@/lib/dal'
import { formatDate } from '@/lib/formatters'

const query = `#graphql
  query CVAuthenticate($crn: ID!) {
    customer(crn: $crn) {
      authenticationQuestions {
        memorableDate
        memorableLocation
        memorableEvent
        updatedAt
      }
    }
  }
`

export async function GET(_, { params }) {
  const response = await dalRequest({ query, variables: await params })

  if (response.status) {
    // If status code is already set, dalRequest has already determined that an error has occurred
    // that should be returned to the consumer
    return response
  }

  const authenticationQuestions =
    response?.data?.customer?.authenticationQuestions

  return NextResponse.json([
    {
      dt: 'Memorable Date',
      dd: authenticationQuestions?.memorableDate || '(Not set)'
    },
    {
      dt: 'Memorable Location',
      dd: authenticationQuestions?.memorableLocation || '(Not set)'
    },
    {
      dt: 'Memorable Event',
      dd: authenticationQuestions?.memorableEvent || '(Not set)'
    },
    {
      dt: 'Updated At',
      dd: authenticationQuestions?.updatedAt
        ? formatDate(authenticationQuestions?.updatedAt)
        : '(Not set)'
    }
  ])
}
