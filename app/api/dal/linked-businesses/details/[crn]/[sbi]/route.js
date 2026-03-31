import { dalRequest } from '@/lib/dal'
import { uppercaseSnakeToTitleCase } from '@/lib/formatters'
import { logger } from '@/lib/logger'

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
    if (errors?.length) {
      const error = errors.map((er) => er.stack).join('\n')
      logger.warn(
        { error, req },
        `Problem retrieving business for customer with SBI: ${sbi}`
      )
      return Response.error(
        {
          message: 'Error fetching business and permissions for customer',
          error
        },
        { status: 500 }
      )
    }

    const business = data?.customer?.business

    return Response.json({
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
  } catch (error) {
    logger.warn(
      { error, req },
      `Problem retrieving customers for business with SBI: ${sbi}`
    )
    return Response.error(
      {
        message: 'Error fetching business and permissions for customer',
        error,
        req
      },
      {
        status: error.status ?? 500,
        statusText: error.statusText ?? 'ServerError'
      }
    )
  }
}
