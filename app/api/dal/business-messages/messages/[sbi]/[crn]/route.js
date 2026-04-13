import { dalRequest } from '@/lib/dal'
import { dalApiResponse, handleApiError } from '@/lib/api.js'

const query = `#graphql
  query CustomerBusinessMessages($sbi: ID!, $crn: ID!, $fromDate: Date) {
    customer(crn: $crn) {
      business(sbi: $sbi) {
        messages(fromDate: $fromDate) {
          id
          subject
          date
          body
          read
          deleted
        }
      }
    }
  }
`

export async function GET(request, ctx) {
  const { sbi, crn } = await ctx.params
  const { searchParams } = new URL(request.url)
  const fromDate = searchParams.get('fromDate')

  const variables = { sbi, crn }
  if (fromDate) {
    variables.fromDate = fromDate
  }

  try {
    const response = await dalRequest({
      query,
      variables
    })

    return dalApiResponse(
      request,
      response,
      response?.data?.customer?.business?.messages || [],
      `Problem retrieving business messages with CRN: ${variables.crn}, SBI: ${variables.sbi}, fromDate: ${variables.fromDate}`
    )
  } catch (error) {
    return handleApiError(
      request,
      error,
      `Problem retrieving business messages with CRN: ${variables.crn}, SBI: ${variables.sbi}, fromDate: ${variables.fromDate}`
    )
  }
}
