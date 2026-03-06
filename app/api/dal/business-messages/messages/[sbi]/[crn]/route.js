import { dalRequest } from '@/lib/dal'

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

  const response = await dalRequest({
    query,
    variables
  })

  return Response.json(response?.data?.customer?.business?.messages || [])
}
