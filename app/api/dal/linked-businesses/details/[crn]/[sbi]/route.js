import { handleApiError, partialResponse } from '@/lib/api'
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

export async function GET(req, { params }) {
  const { crn, sbi } = await params

  try {
    const response = await dalRequest({ query, variables: { crn, sbi } })

    const { data, errors } = response
    const business = data?.customer?.business
    const details = {
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
    }

    if (errors?.length) {
      return partialResponse(
        req,
        errors,
        `Problem retrieving business details with CRN: ${crn}, SBI: ${sbi}`
      )
    }

    return Response.json(details)
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving business details with CRN: ${crn}, SBI: ${sbi}`
    )
  }
}
