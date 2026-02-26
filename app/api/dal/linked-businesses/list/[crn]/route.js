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

  return Response.json(response?.data?.customer?.businesses || [])
}
