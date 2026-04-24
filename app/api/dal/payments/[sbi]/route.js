import { dalApiResponse, handleApiError } from '@/lib/api.js'
import { dalRequest } from '@/lib/dal'

const query = `#graphql
  query BusinessCustomer($sbi: ID!, $userIP: String!) {
    business(sbi: $sbi) {
      sbi
      payments(userIP: $userIP) {
        onHold
        payments {
          reference
          date
          amount
          currency
          lineItems {
            agreementClaimNo
            scheme
            marketingYear
            description
            amount
          }
        }
      }
    }
  }
`

function resolveUserIP(request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip')
}

export async function GET(request, ctx) {
  const { sbi } = await ctx.params
  const userIP = resolveUserIP(request)
  const variables = { sbi, userIP }

  try {
    const apiResponse = await dalRequest({ query, variables })

    const paymentsData = apiResponse?.data?.business?.payments ?? {}
    const payments = (paymentsData.payments ?? []).sort((a, b) =>
      (a.date ?? '').localeCompare(b.date ?? '')
    )

    const responsePayload = {
      onHold: paymentsData.onHold ?? false,
      payments
    }

    return dalApiResponse(
      request,
      apiResponse,
      responsePayload,
      `Problem retrieving payments with SBI: ${sbi}`
    )
  } catch (error) {
    return handleApiError(
      request,
      error,
      `Problem retrieving payments with SBI: ${sbi}`
    )
  }
}
