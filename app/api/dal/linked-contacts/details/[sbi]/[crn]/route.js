import { NextResponse } from 'next/server'

import { handleApiError, partialResponse } from '@/lib/api'
import { dalRequest } from '@/lib/dal'
import { uppercaseSnakeToTitleCase } from '@/lib/formatters'

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
      }
    }
  }
`

export async function GET(req, { params }) {
  const { sbi, crn } = await params

  try {
    const response = await dalRequest({ query, variables: { sbi, crn } })

    const { data, errors } = response
    const { business, customer } = data ?? {}
    const name = customer?.info?.name
    const details = {
      displayName: [name?.first, name?.last].join(' '),
      details: [
        { dt: 'CRN', dd: customer?.crn },
        {
          dt: 'Full Name',
          dd: [name?.title, name?.first, name?.middle, name?.last].join(' ')
        },
        { dt: 'Role', dd: business?.customer?.role }
      ],
      permissions: business?.customer?.permissionGroups.map((item) => ({
        dt: uppercaseSnakeToTitleCase(item.id),
        dd: uppercaseSnakeToTitleCase(item.level),
        expand: item.functions
      }))
    }

    if (errors?.length) {
      return partialResponse(
        req,
        errors,
        `Problem retrieving customer details with SBI: ${sbi}, CRN: ${crn}`,
        details
      )
    }

    return NextResponse.json(details)
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving customer details with SBI: ${sbi}, CRN: ${crn}`
    )
  }
}
