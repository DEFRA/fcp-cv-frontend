import { dalRequest } from '@/lib/dal'

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
    code: '120',
    name: 'Permanent Grassland',
    areaKey: 'permanentGrasslandArea'
  },
  { code: '130', name: 'Permanent Crop Land', areaKey: 'permanentCropsArea' }
]

export async function GET(request, ctx) {
  const { sbi } = await ctx.params
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  const variables = { sbi }
  if (date) {
    variables.date = date
  }

  const response = await dalRequest({ query, variables })

  if (response.status && !response.ok) {
    // If status code is already set, dalRequest has already determined that an error has occurred
    // that should be returned to the consumer
    return response
  }

  const land = response?.data?.business?.land || {}
  const parcels = (land.parcels || []).map((parcel) => ({
    ...parcel,
    id: `${parcel.sheetId}-${parcel.parcelId}`
  }))
  const summary = land.summary || {}

  const pendingParcels = parcels.filter((p) => p.pendingDigitisation).length

  const landCovers = LAND_COVERS.map(({ code, name, areaKey }) => ({
    code,
    name,
    area: summary[areaKey] ?? 0
  }))

  return Response.json({
      parcels,
      summary: { ...summary, pendingParcels },
      landCovers
  })
}
