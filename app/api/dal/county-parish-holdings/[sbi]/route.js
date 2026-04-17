import { dalRequest } from '@/lib/dal'
import { formatDate } from '@/lib/formatters'
import { dalApiResponse, handleApiError } from '@/lib/api.js'

const query = `#graphql
  query CVCountyParishHoldings($sbi: ID!) {
    business(sbi: $sbi) {
      countyParishHoldings {
        cphNumber
        parish
        startDate
        endDate
        species
        xCoordinate
        yCoordinate
        address
      }
    }
  }
`

export async function GET(req, { params }) {
  const { sbi } = await params
  try {
    const apiResponse = await dalRequest({ query, variables: { sbi } })

    const responsePayload = (
      apiResponse?.data?.business?.countyParishHoldings || []
    ).reduce(
      ({ list, details }, cph) => ({
        list: [
          ...list,
          {
            cphNumber: cph.cphNumber,
            parish: cph.parish,
            startDate: formatDate(cph.startDate),
            endDate: formatDate(cph.endDate),
            species: cph.species,
            xCoordinate: cph.xCoordinate,
            yCoordinate: cph.yCoordinate,
            address: cph.address
          }
        ],
        details: {
          ...details,
          [cph.cphNumber]: [
            { dt: 'Parish', dd: cph.parish },
            { dt: 'Start Date', dd: formatDate(cph.startDate) },
            { dt: 'End Date', dd: formatDate(cph.endDate) },
            {
              dt: 'Coordinates (x, y)',
              dd: `${cph.xCoordinate}, ${cph.yCoordinate}`
            },
            { dt: 'Species', dd: cph.species },
            { dt: 'Address', dd: cph.address }
          ]
        }
      }),
      {
        list: [],
        details: {}
      }
    )

    return dalApiResponse(
      req,
      apiResponse,
      responsePayload,
      `Problem retrieving county parish holdings with SBI: ${sbi}`
    )
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving county parish holdings with SBI: ${sbi}`
    )
  }
}
