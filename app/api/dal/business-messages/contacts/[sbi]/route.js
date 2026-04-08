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
function errorDescription(sbi) {
  return `Problem retrieving business messages contacts with SBI: ${sbi}`
}

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
      errorDescription(sbi)
    )
  } catch (error) {
    return handleApiError(req, error, errorDescription(sbi))
  }
}
