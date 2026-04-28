import { dalRequest } from '@/lib/dal'
import { formatDate, formatDateAndTime } from '@/lib/formatters'
import { dalApiResponse, handleApiError } from '@/lib/api.js'

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

export async function GET(req, { params }) {
  const { sbi } = await params
  try {
    const apiResponse = await dalRequest({
      query,
      variables: await params
    })

    const applications = apiResponse?.data?.business?.applications || []

    const list = []
    const details = {}

    for (const application of applications) {
      const lastMovement = application.transitionHistory?.[0]

      list.push({
        id: application.id,
        year: application.year,
        name: application.name,
        status: application.status,
        scheme: application.scheme,
        agreementReferences: application.agreementReferences.join(', ')
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
          {
            dt: 'Agreement References',
            dd: application.agreementReferences.join(', ')
          },
          { dt: 'Last Movement', dd: lastMovement?.name },
          {
            dt: 'Last Movement Date/Time',
            dd: formatDateAndTime(lastMovement?.timestamp)
          }
        ],
        movementHistory: application.transitionHistory?.map((item) => ({
          ...item,
          formattedDate: formatDateAndTime(item.timestamp)
        }))
      }
    }

    list.sort((a, b) => parseInt(b.year) - parseInt(a.year))

    return dalApiResponse(
      req,
      apiResponse,
      { list, details },
      `Problem retrieving applications with SBI: ${sbi}`
    )
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving applications with SBI: ${sbi}`
    )
  }
}
