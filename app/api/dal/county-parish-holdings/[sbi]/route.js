import { dalRequest } from '@/lib/dal'
import { formatDate } from '@/lib/formatters'

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

export async function GET(_, { params }) {
  const response = await dalRequest({ query, variables: await params })

  if (response.status) {
    // If status code is already set, dalRequest has already determined that an error has occurred
    // that should be returned to the consumer
    return response
  }

  return Response.json(
    (response?.data?.business?.countyParishHoldings || []).reduce(
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
  )
}
