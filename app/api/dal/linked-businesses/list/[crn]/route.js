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

function errorDescription(crn) {
  return `Problem retrieving businesses for customer with CRN: ${crn}`
}

export async function GET(req, { params }) {
  const { crn } = await params

  try {
    const response = await dalRequest({ query, variables: { crn } })

    const { data, errors } = response
    const businesses = data?.customer?.businesses ?? []

    if (errors?.length) {
      return partialResponse(req, errors, errorDescription(crn), businesses)
    }

    return Response.json(businesses)
  } catch (error) {
    return handleApiError(req, error, errorDescription(crn))
  }
}
