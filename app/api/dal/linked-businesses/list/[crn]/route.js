import { handleApiError, partialResponse } from '@/lib/api'
import { dalRequest } from '@/lib/dal'

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

export async function GET(req, { params }) {
  const { crn } = await params

  try {
    const response = await dalRequest({ query, variables: { crn } })

    const { data, errors } = response
    const businesses = data?.customer?.businesses ?? []

    if (errors?.length) {
      return partialResponse(
        req,
        errors,
        `Problem retrieving businesses for customer with CRN: ${crn}`,
        data
      )
    }

    return Response.json(businesses)
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving businesses for customer with CRN: ${crn}`
    )
  }
}
