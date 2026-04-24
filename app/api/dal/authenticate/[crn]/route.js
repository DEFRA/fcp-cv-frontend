import { dalRequest } from '@/lib/dal'
import { formatDateAndTime } from '@/lib/formatters'
import { dalApiResponse, handleApiError } from '@/lib/api.js'

const query = `#graphql
  query CVAuthenticate($crn: ID!) {
    customer(crn: $crn) {
      authenticationQuestions {
        memorableDate
        memorableLocation
        memorableEvent
        updatedAt
      }
    }
  }
`

export async function GET(req, { params }) {
  const { crn } = await params
  try {
    const apiResponse = await dalRequest({ query, variables: { crn } })

    const authenticationQuestions =
      apiResponse?.data?.customer?.authenticationQuestions

    const responsePayload = [
      {
        dt: 'Memorable Date',
        dd: authenticationQuestions?.memorableDate || '(Not set)'
      },
      {
        dt: 'Memorable Location',
        dd: authenticationQuestions?.memorableLocation || '(Not set)'
      },
      {
        dt: 'Memorable Event',
        dd: authenticationQuestions?.memorableEvent || '(Not set)'
      },
      {
        dt: 'Updated At',
        dd: authenticationQuestions?.updatedAt
          ? formatDateAndTime(authenticationQuestions?.updatedAt)
          : '(Not set)'
      }
    ]
    return dalApiResponse(
      req,
      apiResponse,
      responsePayload,
      `Problem retrieving authentication questions with CRN: ${crn}`
    )
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving authentication questions with CRN: ${crn}`
    )
  }
}
