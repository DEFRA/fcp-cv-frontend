import { dalRequest } from '@/lib/dal'
import { formatDate } from '@/lib/formatters'

const query = `#graphql
  query CVCountyParishHoldings($sbi: ID!) {
    business(sbi: $sbi) {
      applications {
        sbi
        id
        year
        name
        scheme
        status
        submissionDate
        portalStatus
        agreementReferences
        transitionHistory {
          id
          name
          timestamp
          checkStatus
        }
      }
    }
  }
`

export async function GET(_, { params }) {
  const response = await dalRequest({
    query,
    variables: await params
  })

  return Response.json(
    (response?.data?.business?.applications || []).reduce(
      (
        { list, details },
        {
          id,
          year,
          name,
          status,
          scheme,
          portalStatus,
          submissionDate,
          agreementReferences,
          transitionHistory
        }
      ) => {
        const lastMovement = transitionHistory[transitionHistory.length - 1]
        return {
          list: [
            ...list,
            {
              id: id,
              year: year,
              name: name,
              status: status
            }
          ],
          details: {
            ...details,
            [id]: {
              name,
              summary: [
                { dt: 'Application ID', dd: id },
                { dt: 'Scheme', dd: scheme },
                { dt: 'Year', dd: year },
                { dt: 'Status', dd: status },
                { dt: 'Status (Portal)', dd: portalStatus },
                { dt: 'Submitted Date', dd: formatDate(submissionDate) },
                { dt: 'Agreement References', dd: agreementReferences },
                { dt: 'Last Movement', dd: lastMovement.name },
                {
                  dt: 'Last Movement Date/Time',
                  dd: formatDate(lastMovement.timestamp)
                }
              ],
              movementHistory: transitionHistory
            }
          }
        }
      },
      {
        list: [],
        details: {}
      }
    )
  )
}
