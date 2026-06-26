import { dalApiResponse, handleApiError } from '@/lib/api.js'
import { getIPFromToken } from '@/lib/auth'
import { dalRequest } from '@/lib/dal'
import { formatCurrency, formatDate } from '@/lib/formatters'

const query = `#graphql
  query BusinessCustomer($sbi: ID, $userIP: String!) {
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
            agreementNumber
            claimReferenceNumber
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

export async function GET(request, ctx) {
  const { sbi } = await ctx.params

  try {
    const userIP = await getIPFromToken(request.headers)
    const variables = { sbi, userIP }
    const apiResponse = await dalRequest({ query, variables })

    const paymentsData = apiResponse?.data?.business?.payments ?? {}
    const payments = (paymentsData.payments ?? [])
      .toSorted((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
      .map((payment, index) => ({
        ...payment,
        id: (index + 1).toString(),
        amount: formatCurrency(payment.amount, payment.currency),
        date: formatDate(payment.date),
        lineItems: payment.lineItems.map(
          ({ agreementNumber, claimReferenceNumber, ...lineItem }) => ({
            ...lineItem,
            agreementClaimNo: `${agreementNumber}/${claimReferenceNumber}`,
            amount: formatCurrency(lineItem.amount, payment.currency)
          })
        )
      }))
      .filter((payment) => payment.reference?.startsWith('PY'))

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
