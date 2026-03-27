import { dalRequest } from '@/lib/dal'
import { NextResponse } from 'next/server'

const query = `#graphql
  query CVLinkedBusinessesList($crn: ID!) {
    customer(crn: $crn) {
      businesses {
        sbi
        name
      }
    }
  }
`

export async function GET(_, { params }) {
  try {
    const response = await dalRequest({ query, variables: await params })

    return Response.json(response?.data?.customer?.businesses || [])
  } catch ({ name, message, status, statusText }) {
    return NextResponse.json(
      { error: `${name} ${message}` },
      { status, statusText }
    )
  }
}
