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

  if (response.status) {
    // If status code is already set, dalRequest has already determined that an error has occurred
    // that should be returned to the consumer
    return response
  }

  const applications = response?.data?.business?.applications || []

  const list = []
  const details = {}

  for (const application of applications) {
    const lastMovement = application.transitionHistory?.at(-1)

    list.push({
      id: application.id,
      year: application.year,
      name: application.name,
      status: application.status
    })

    details[application.id] = {
      name: application.name,
      summary: [
        { dt: 'Application ID', dd: application.id },
        { dt: 'Scheme', dd: application.scheme },
        { dt: 'Year', dd: application.year },
        { dt: 'Status', dd: application.status },
        { dt: 'Status (Portal)', dd: application.portalStatus },
        { dt: 'Submitted Date', dd: formatDate(application.submissionDate) },
        { dt: 'Agreement References', dd: application.agreementReferences },
        { dt: 'Last Movement', dd: lastMovement?.name },
        {
          dt: 'Last Movement Date/Time',
          dd: formatDate(lastMovement?.timestamp)
        }
      ],
      movementHistory: application.transitionHistory
    }
  }

  return Response.json({ list, details })
}
