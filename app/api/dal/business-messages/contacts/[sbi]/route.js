import { dalRequest } from '@/lib/dal'

const query = `#graphql
  query GetListOfCustomers($sbi: ID!) {
    business(sbi: $sbi) {
      customers {
        crn
        firstName
        lastName
      }
    }
  }
`

export async function GET(_, ctx) {
  const { sbi } = await ctx.params

  const response = await dalRequest({
    query,
    variables: {
      sbi
    }
  })

  if (response.status) {
    // If status code is already set, dalRequest has already determined that an error has occurred
    // that should be returned to the consumer
    return response
  }

  return Response.json(response?.data?.business?.customers || [])
}
