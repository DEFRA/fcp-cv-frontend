import { dalRequest } from '@/lib/dal'
import { dalApiResponse, handleApiError } from '@/lib/api.js'

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

export async function GET(req, ctx) {
  const { sbi } = await ctx.params

  try {
    const response = await dalRequest({
      query,
      variables: {
        sbi
      }
    })

    return dalApiResponse(
      req,
      response,
      response?.data?.business?.customers || [],
      () => `Problem retrieving business messages contacts with SBI: ${sbi}`
    )
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving business messages contacts with SBI: ${sbi}`
    )
  }
}
