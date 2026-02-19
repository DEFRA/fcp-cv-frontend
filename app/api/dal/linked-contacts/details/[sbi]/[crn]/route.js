import { NextResponse } from 'next/server'

import { dalRequest } from '@/lib/dal'
import { screamingSnakeToTitleCase } from '@/lib/formatters'

const query = `#graphql
  query CVLinkedContactsDetail($sbi: ID!, $crn: ID!) {
    business(sbi: $sbi) {
      customer(crn: $crn) {
        role
        permissionGroups {
          id
          level
          functions
        }
      }
    }
    customer(crn: $crn) {
      crn
      info {
        name {
          title
          first
          middle
          last
        }
        dateOfBirth
      }
    }
  }
`

export async function GET(_, { params }) {
  const { sbi, crn } = await params

  const response = await dalRequest({
    query,
    variables: {
      sbi,
      crn
    }
  })

  const name = response?.data?.customer?.info?.name

  return NextResponse.json({
    displayName: [name?.first, name?.last].join(' '),
    details: [
      { dt: 'CRN', dd: response?.data?.customer?.crn },
      {
        dt: 'Full Name',
        dd: [name?.title, name?.first, name?.middle, name?.last].join(' ')
      },
      { dt: 'Role', dd: response?.data?.business?.customer?.role }
    ],
    permissions: response?.data?.business?.customer?.permissionGroups.map(
      (item) => ({
        dt: screamingSnakeToTitleCase(item.id),
        dd: screamingSnakeToTitleCase(item.level),
        expand: item.functions
      })
    )
  })
}
