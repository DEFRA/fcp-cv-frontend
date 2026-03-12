import { dalRequest } from '@/lib/dal'
import { formatDate } from '@/lib/formatters'

const query = `#graphql
  query BusinessLandParcelCovers($sbi: ID!, $date: Date, $sheetId: ID!, $parcelId: ID!) {
    business(sbi: $sbi) {
      land {
        parcel(date: $date, sheetId: $sheetId, parcelId: $parcelId) {
          sheetId
          parcelId
          area
          pendingDigitisation
          effectiveToDate
          effectiveFromDate
        }
        parcelCovers(date: $date, sheetId: $sheetId, parcelId: $parcelId) {
          code
          name
          area
        }
        parcelLandUses(sheetId: $sheetId, parcelId: $parcelId, date: $date) {
          code
          startDate
          endDate
          insertDate
          deleteDate
          area
          length
          type
        }
      }
    }
  }
`

export async function GET(request, ctx) {
  const { sbi } = await ctx.params
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const sheetId = searchParams.get('sheetId')
  const parcelId = searchParams.get('parcelId')

  const variables = { sbi, sheetId, parcelId }
  if (date) {
    variables.date = date
  }

  const response = await dalRequest({ query, variables })

  const land = response?.data?.business?.land || {}
  const parcel = land.parcel || {}
  const parcelCovers = land.parcelCovers || []
  const parcelLandUses = land.parcelLandUses || []

  return Response.json({
    parcel: {
      ...parcel,
      effectiveFromDate: parcel.effectiveFromDate
        ? formatDate(parcel.effectiveFromDate)
        : '',
      effectiveToDate: parcel.effectiveToDate
        ? formatDate(parcel.effectiveToDate)
        : ''
    },
    parcelCovers,
    parcelLandUses: parcelLandUses.map((use) => ({
      ...use,
      startDate: use.startDate ? formatDate(use.startDate) : '',
      endDate: use.endDate ? formatDate(use.endDate) : '',
      insertDate: use.insertDate ? formatDate(use.insertDate) : '',
      deleteDate: use.deleteDate ? formatDate(use.deleteDate) : ''
    }))
  })
}
