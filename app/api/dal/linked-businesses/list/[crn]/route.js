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

export async function GET(_, { params }) {
  const response = await dalRequest({ query, variables: await params })

  if (response.status) {
    // If status code is already set, dalRequest has already determined that an error has occurred
    // that should be returned to the consumer
    return response
  }

  return Response.json(response?.data?.customer?.businesses || [])
}
