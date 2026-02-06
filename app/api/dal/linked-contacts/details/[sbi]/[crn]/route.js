import { NextResponse } from 'next/server'

import { dalRequest } from '@/lib/dal'

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

  const name = response.data.customer.info.name

  const permissions = {}
  response.data.business.customer.permissionGroups.forEach((item) => {
    permissions[item.id] = item.level
  })

  return NextResponse.json({
    displayName: [name.first, name.last].join(' '),
    customerDetails: {
      CRN: response.data.customer.crn,
      'Full Name': [name.title, name.first, name.middle, name.last].join(' '),
      Role: response.data.business.customer.role
    },
    permissions
  })
}
