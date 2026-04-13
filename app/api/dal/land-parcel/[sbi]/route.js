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
  const parcelCovers = (land.parcelCovers || []).sort((a, b) =>
    a.code.localeCompare(b.code)
  )
  const parcelLandUses = (land.parcelLandUses || []).sort((a, b) => {
    const dateA = new Date(a.startDate)
    const dateB = new Date(b.startDate)
    if (dateA.getTime() !== dateB.getTime())
      return dateB.getTime() - dateA.getTime() // desc
    return a.code.localeCompare(b.code) // asc
  })

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
    parcelLandUses: parcelLandUses.map((use) => {
      const formatDateIfValid = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return isNaN(date.getTime()) ? '' : formatDate(dateStr)
      }

      return {
        ...use,
        startDate: formatDateIfValid(use.startDate),
        endDate: formatDateIfValid(use.endDate),
        insertDate: formatDateIfValid(use.insertDate),
        deleteDate: formatDateIfValid(use.deleteDate)
      }
    })
  })
}
