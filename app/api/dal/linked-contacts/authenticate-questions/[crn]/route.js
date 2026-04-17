import { dalRequest } from '@/lib/dal'
import { formatDate } from '@/lib/formatters'
import { dalApiResponse, handleApiError } from '@/lib/api.js'

const query = `#graphql
  query CVLinkedContactsAuthenticationQuestions($crn: ID!) {
    customer(crn: $crn) {
      info {
        dateOfBirth
      }
      authenticationQuestions {
        isFound
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
    const apiResponse = await dalRequest({
      query,
      variables: {
        crn
      }
    })

    const authenticationQuestions =
      apiResponse?.data?.customer?.authenticationQuestions

    const responsePayload = {
      items: [
        {
          dt: 'Date of Birth',
          dd: apiResponse?.data?.customer?.info?.dateOfBirth
            ? formatDate(apiResponse.data.customer.info.dateOfBirth)
            : '(Not set)'
        },
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
            ? formatDate(authenticationQuestions?.updatedAt)
            : '(Not set)'
        }
      ]
    }
    return dalApiResponse(
      req,
      apiResponse,
      responsePayload,
      `Problem retrieving linked contact authenticate questions with crn: ${crn}`
    )
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving linked contact authenticate questions with crn: ${crn}`
    )
  }
}
