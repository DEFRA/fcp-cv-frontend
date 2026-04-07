import { dalRequest } from '@/lib/dal'
import { dalApiResponse, handleApiError } from '@/lib/api.js'

const query = `#graphql
  query BusinessLandParcels($sbi: ID!, $date: Date) {
    business(sbi: $sbi) {
      land {
        parcels(date: $date) {
          sheetId
          parcelId
          area
          pendingDigitisation
        }
        summary(date: $date) {
          totalParcels
          totalArea
          arableLandArea
          permanentCropsArea
          permanentGrasslandArea
        }
      }
    }
  }
`

const LAND_COVERS = [
  { code: '110', name: 'Arable Land', areaKey: 'arableLandArea' },
  {
    code: '130',
    name: 'Permanent Grassland',
    areaKey: 'permanentGrasslandArea'
  },
  { code: '140', name: 'Permanent Crop Land', areaKey: 'permanentCropsArea' }
]

export async function GET(request, ctx) {
  const { sbi } = await ctx.params
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  const variables = { sbi }
  if (date) {
    variables.date = date
  }

  try {
    const response = await dalRequest({ query, variables })

  const land = response?.data?.business?.land || {}
  const parcels = (land.parcels || [])
    .sort((a, b) => {
      if (a.sheetId !== b.sheetId) return a.sheetId.localeCompare(b.sheetId)
      return a.parcelId.localeCompare(b.parcelId)
    })
    .map((parcel) => ({
      ...parcel,
      id: `${parcel.sheetId}-${parcel.parcelId}`,
      pendingDigitisation: parcel.pendingDigitisation ? 'Yes' : 'No'
    }))
  const summary = land.summary || {}

  const pendingParcels = parcels.filter(
    (p) => p.pendingDigitisation === 'Yes'
  ).length

  const landCovers = LAND_COVERS.map(({ code, name, areaKey }) => ({
    code,
    name,
    area: summary[areaKey] ?? 0
  })).sort((a, b) => a.code.localeCompare(b.code))

    const responsePayload = {
      parcels,
      summary: { ...summary, pendingParcels },
      landCovers
    }

    return dalApiResponse(
      request,
      response,
      responsePayload,
      () => `Problem retrieving land details with SBI: ${sbi}`
    )
  } catch (error) {
    return handleApiError(
      request,
      error,
      `Problem retrieving land details with SBI: ${sbi}`
    )
  }
}
