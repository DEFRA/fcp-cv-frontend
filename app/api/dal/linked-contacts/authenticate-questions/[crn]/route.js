import { NextResponse } from 'next/server'

import { dalRequest } from '@/lib/dal'

const query = `#graphql
  query CVLinkedContactsAuthenticationQuestions($crn: ID!) {
    customer(crn: $crn) {
      authenticationQuestions {
        isFound
        memorableDate
        memorableLocation
        memorableEvent
        updatedAt
      }
    }
  }
`

export async function GET(_, ctx) {
  const { sbi, crn } = await ctx.params

  const response = await dalRequest({
    query,
    variables: {
      sbi,
      crn
    }
  })

  if (!response.data) {
    throw new Error('no data')
  }

  const authenticationQuestions = response.data.customer.authenticationQuestions

  return NextResponse.json({
    items: {
      'Memorable Date': authenticationQuestions.memorableDate || 'Not set',
      'Memorable Location':
        authenticationQuestions.memorableLocation || 'Not set',
      'Memorable Event': authenticationQuestions.memorableEvent || 'Not set',
      'Updated at': authenticationQuestions.updatedAt || 'Not set'
    }
  })
}
