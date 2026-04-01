import { NextResponse } from 'next/server'

import { dalRequest } from '@/lib/dal'
import { uppercaseSnakeToTitleCase } from '@/lib/formatters'

const query = `#graphql
  query CVLinkedBusinessesDetails($sbi: ID!, $crn: ID!) {
    customer(crn: $crn) {
      business(sbi: $sbi) {
        name
        sbi
        role
        permissionGroups {
          id
          level
          functions
        }
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

  const business = response?.data?.customer?.business

  return NextResponse.json({
    name: business?.name,
    details: [
      { dt: 'SBI', dd: business?.sbi },
      { dt: 'Role', dd: business?.role }
    ],
    permissions: business?.permissionGroups.map((item) => ({
      dt: uppercaseSnakeToTitleCase(item.id),
      dd: uppercaseSnakeToTitleCase(item.level),
      expand: item.functions
    }))
  })
}
