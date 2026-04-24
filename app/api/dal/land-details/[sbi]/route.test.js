import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Land Details API route', () => {
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

  test('makes a dal request with the sbi param', async () => {
    vi.mocked(dalRequest).mockResolvedValue({})
    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    expect(response.status).toBe(200)
    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({ sbi: '123456789' })
      })
    )
  })

  test('does not include date in variables when not provided', async () => {
    await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.not.objectContaining({ date: expect.anything() })
      })
    )
  })

  test('includes date in variables when provided', async () => {
    await GET(new NextRequest('http://localhost?date=2021-11-15'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({ date: '2021-11-15' })
      })
    )
  })

  test('returns parcels with a computed composite id', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          land: {
            parcels: [
              {
                sheetId: 'SS6528',
                parcelId: '8779',
                area: 5.12,
                pendingDigitisation: false
              },
              {
                sheetId: 'SS6528',
                parcelId: '9001',
                area: 2.3,
                pendingDigitisation: true
              }
            ],
            summary: {
              totalParcels: 2,
              totalArea: 7.42,
              arableLandArea: 3.0,
              permanentGrasslandArea: 2.5,
              permanentCropsArea: 1.92
            }
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    const body = await response.json()

    expect(body.parcels).toStrictEqual([
      {
        sheetId: 'SS6528',
        parcelId: '8779',
        area: 5.12,
        pendingDigitisation: 'No',
        id: 'SS6528-8779'
      },
      {
        sheetId: 'SS6528',
        parcelId: '9001',
        area: 2.3,
        pendingDigitisation: 'Yes',
        id: 'SS6528-9001'
      }
    ])
  })

  test('returns summary with pendingParcels count derived from parcels', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          land: {
            parcels: [
              {
                sheetId: 'SS6528',
                parcelId: '8779',
                area: 5.12,
                pendingDigitisation: false
              },
              {
                sheetId: 'SS6528',
                parcelId: '9001',
                area: 2.3,
                pendingDigitisation: true
              },
              {
                sheetId: 'SS6528',
                parcelId: '9002',
                area: 1.1,
                pendingDigitisation: true
              }
            ],
            summary: {
              totalParcels: 3,
              totalArea: 8.52,
              arableLandArea: 3.0,
              permanentGrasslandArea: 2.5,
              permanentCropsArea: 1.92
            }
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    const body = await response.json()

    expect(body.summary).toStrictEqual({
      totalParcels: 3,
      totalArea: 8.52,
      arableLandArea: 3.0,
      permanentGrasslandArea: 2.5,
      permanentCropsArea: 1.92,
      pendingParcels: 2
    })
  })

  test('returns landCovers built from summary area fields', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          land: {
            parcels: [],
            summary: {
              totalParcels: 0,
              totalArea: 7.42,
              arableLandArea: 228.2947,
              permanentGrasslandArea: 530.1988,
              permanentCropsArea: 7.3368
            }
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    const body = await response.json()

    expect(body.landCovers).toStrictEqual([
      { code: '110', name: 'Arable Land', area: 228.2947 },
      { code: '130', name: 'Permanent Grassland', area: 530.1988 },
      { code: '140', name: 'Permanent Crop Land', area: 7.3368 }
    ])
  })

  test('defaults land cover area to 0 when summary field is missing', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          land: {
            parcels: [],
            summary: {}
          }
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    const body = await response.json()

    expect(body.landCovers).toStrictEqual([
      { code: '110', name: 'Arable Land', area: 0 },
      { code: '130', name: 'Permanent Grassland', area: 0 },
      { code: '140', name: 'Permanent Crop Land', area: 0 }
    ])
  })

  test('returns empty parcels, empty summary and zero land covers when dal returns no data', async () => {
    vi.mocked(dalRequest).mockResolvedValue({})

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: '123456789' })
    })

    const body = await response.json()

    expect(body.parcels).toStrictEqual([])
    expect(body.summary).toStrictEqual({ pendingParcels: 0 })
    expect(body.landCovers).toStrictEqual([
      { code: '110', name: 'Arable Land', area: 0 },
      { code: '130', name: 'Permanent Grassland', area: 0 },
      { code: '140', name: 'Permanent Crop Land', area: 0 }
    ])
  })

  test('should return partial response with errors if DAL response has errors', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {},
      errors: [{ message: 'some error' }]
    })
    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(206)
    const body = await response.json()
    expect(body.parcels).toStrictEqual([])
  })

  test('should return 500 if DAL request throws error', async () => {
    vi.mocked(dalRequest).mockRejectedValue(new Error('DAL error'))
    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(500)
  })
})
