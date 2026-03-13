import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

const mockLandResponse = {
  data: {
    business: {
      land: {
        parcel: {
          sheetId: 'SS6528',
          parcelId: '8779',
          area: 5.12,
          pendingDigitisation: false,
          effectiveFromDate: '2021-11-15',
          effectiveToDate: '2022-03-31'
        },
        parcelCovers: [
          { code: '110', name: 'Arable Land', area: 3.5 },
          { code: '120', name: 'Permanent Grassland', area: 1.62 }
        ],
        parcelLandUses: [
          {
            code: 'AC01',
            type: 'Area',
            area: 3.5,
            length: null,
            startDate: '2021-11-15',
            endDate: '2022-03-31',
            insertDate: '2021-01-01',
            deleteDate: ''
          }
        ]
      }
    }
  }
}

describe('Land Parcel API route', () => {
  beforeAll(() => {
    vi.mock('next/headers', () => ({
      headers: () => ({
        get: () => 'mocked-token'
      })
    }))
    vi.mock('@/lib/auth', () => ({
      getEmailFromToken: () => 'test@example.com'
    }))
    vi.mock('@/lib/dal', () => ({
      dalRequest: vi.fn()
    }))
  })

  test('makes a dal request with sbi, sheetId and parcelId params', async () => {
    const response = await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    expect(response.status).toBe(200)
    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          sbi: '123456789',
          sheetId: 'SS6528',
          parcelId: '8779'
        })
      })
    )
  })

  test('does not include date in variables when not provided', async () => {
    await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.not.objectContaining({ date: expect.anything() })
      })
    )
  })

  test('includes date in variables when provided', async () => {
    await GET(
      new NextRequest(
        'http://localhost?sheetId=SS6528&parcelId=8779&date=2021-11-15'
      ),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({ date: '2021-11-15' })
      })
    )
  })

  test('returns parcel with formatted effective dates', async () => {
    vi.mocked(dalRequest).mockResolvedValue(mockLandResponse)

    const response = await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    const body = await response.json()

    expect(body.parcel).toStrictEqual({
      sheetId: 'SS6528',
      parcelId: '8779',
      area: 5.12,
      pendingDigitisation: false,
      effectiveFromDate: '15/11/2021',
      effectiveToDate: '31/03/2022'
    })
  })

  test('returns empty strings for missing effective dates', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          land: {
            parcel: {
              sheetId: 'SS6528',
              parcelId: '8779',
              area: 5.12,
              pendingDigitisation: false,
              effectiveFromDate: null,
              effectiveToDate: null
            },
            parcelCovers: [],
            parcelLandUses: []
          }
        }
      }
    })

    const response = await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    const body = await response.json()

    expect(body.parcel.effectiveFromDate).toBe('')
    expect(body.parcel.effectiveToDate).toBe('')
  })

  test('returns parcelCovers unchanged', async () => {
    vi.mocked(dalRequest).mockResolvedValue(mockLandResponse)

    const response = await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    const body = await response.json()

    expect(body.parcelCovers).toStrictEqual([
      { code: '110', name: 'Arable Land', area: 3.5 },
      { code: '120', name: 'Permanent Grassland', area: 1.62 }
    ])
  })

  test('returns parcelLandUses with all dates formatted', async () => {
    vi.mocked(dalRequest).mockResolvedValue(mockLandResponse)

    const response = await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    const body = await response.json()

    expect(body.parcelLandUses).toStrictEqual([
      {
        code: 'AC01',
        type: 'Area',
        area: 3.5,
        length: null,
        startDate: '15/11/2021',
        endDate: '31/03/2022',
        insertDate: '01/01/2021',
        deleteDate: ''
      }
    ])
  })

  test('formats deleteDate when present', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          land: {
            parcel: {
              sheetId: 'SS6528',
              parcelId: '8779',
              area: 1,
              pendingDigitisation: false,
              effectiveFromDate: null,
              effectiveToDate: null
            },
            parcelCovers: [],
            parcelLandUses: [
              {
                code: 'AC01',
                type: 'Area',
                area: 1.0,
                length: null,
                startDate: '',
                endDate: '',
                insertDate: '',
                deleteDate: '2022-06-01'
              }
            ]
          }
        }
      }
    })

    const response = await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    const body = await response.json()

    expect(body.parcelLandUses[0].deleteDate).toBe('01/06/2022')
  })

  test('returns empty string for blank land use dates', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          land: {
            parcel: {
              sheetId: 'SS6528',
              parcelId: '8779',
              area: 1,
              pendingDigitisation: false,
              effectiveFromDate: null,
              effectiveToDate: null
            },
            parcelCovers: [],
            parcelLandUses: [
              {
                code: 'AC01',
                type: 'Area',
                area: 1.0,
                length: null,
                startDate: '',
                endDate: '',
                insertDate: '',
                deleteDate: ''
              }
            ]
          }
        }
      }
    })

    const response = await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    const body = await response.json()

    const landUse = body.parcelLandUses[0]
    expect(landUse.startDate).toBe('')
    expect(landUse.endDate).toBe('')
    expect(landUse.insertDate).toBe('')
    expect(landUse.deleteDate).toBe('')
  })

  test('returns empty parcel, covers and land uses when dal returns no data', async () => {
    vi.mocked(dalRequest).mockResolvedValue({})

    const response = await GET(
      new NextRequest('http://localhost?sheetId=SS6528&parcelId=8779'),
      { params: Promise.resolve({ sbi: '123456789' }) }
    )

    const body = await response.json()

    expect(body.parcel).toStrictEqual({
      effectiveFromDate: '',
      effectiveToDate: ''
    })
    expect(body.parcelCovers).toStrictEqual([])
    expect(body.parcelLandUses).toStrictEqual([])
  })
})
