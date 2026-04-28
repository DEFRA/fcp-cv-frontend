import { dalApiResponse, handleApiError } from '@/lib/api.js'
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

function resolveUserIP(request) {
  const token = request.headers.get('x-msal-access-token')
  if (token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64url').toString()
      )
      if (payload.ipaddr) return payload.ipaddr
    } catch {
      // fall through
    }
  }
  logger.warn('Unable to resolve user IP address from MSAL access token')
  throw new Error('Unable to resolve user IP address from MSAL access token')
}

export async function GET(request, ctx) {
  const { sbi } = await ctx.params

  try {
    const userIP = resolveUserIP(request)
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
