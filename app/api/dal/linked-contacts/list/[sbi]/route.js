import { dalRequest } from '@/lib/dal'

const query = `#graphql
  query CVLinkedContactsList($sbi: ID!) {
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

  return Response.json(response?.data?.business?.customers || [])
}
