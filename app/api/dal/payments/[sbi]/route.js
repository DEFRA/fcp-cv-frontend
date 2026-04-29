import { dalApiResponse, handleApiError } from '@/lib/api.js'
import { getIPFromToken } from '@/lib/auth'
import { dalRequest } from '@/lib/dal'
import { logger } from '@/lib/logger'

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

async function resolveUserIP(request) {
  try {
    return await getIPFromToken(request.headers)
  } catch {
    logger.warn('Unable to resolve user IP address from MSAL access token')
    throw new Error('Unable to resolve user IP address from MSAL access token')
  }
}

export async function GET(request, ctx) {
  const { sbi } = await ctx.params

  try {
    const userIP = await resolveUserIP(request)
    const variables = { sbi, userIP }
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
