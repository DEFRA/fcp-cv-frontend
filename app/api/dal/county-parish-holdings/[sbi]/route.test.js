import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('County Parish Holdings API route', () => {
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

  test('should make dal request with sbi param', async () => {
    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)

    expect(dalRequest).toHaveBeenCalledTimes(1)
    expect(dalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          sbi: 'sbiParam'
        })
      })
    )
  })

  test('should return CPH data', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          countyParishHoldings: [
            {
              cphNumber: '14/975/3854',
              parish: 'Aswardby',
              startDate: '2021-01-27',
              endDate: '2027-11-13',
              species: 'DEER,PIGEONS,SHEEP,POULTRY,GOAT(S),CATTLE,PIG(S),OTHER',
              xCoordinate: 580386,
              yCoordinate: 489268,
              address:
                'DAMNATIO CALCAR FARM, GOYETTE ROAD, LONG GRAHAM, RZ32 6ZD'
            },
            {
              cphNumber: '86/811/4136',
              parish: 'Morton-on-Swale',
              startDate: '2022-07-04',
              endDate: '9999-12-31',
              species: 'CATTLE,PIGEONS,DEER,PIG(S)',
              xCoordinate: 276921,
              yCoordinate: 643321,
              address: 'SOLUM VOMER FARM, ROBEL CHASE, PACOCHAHAMPTON, MX2 9LF'
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      details: {
        '14/975/3854': [
          {
            dd: 'Aswardby',
            dt: 'Parish'
          },
          {
            dd: '27/01/2021',
            dt: 'Start Date'
          },
          {
            dd: '13/11/2027',
            dt: 'End Date'
          },
          {
            dd: '580386, 489268',
            dt: 'Coordinates (x, y)'
          },
          {
            dd: 'DEER,PIGEONS,SHEEP,POULTRY,GOAT(S),CATTLE,PIG(S),OTHER',
            dt: 'Species'
          },
          {
            dd: 'DAMNATIO CALCAR FARM, GOYETTE ROAD, LONG GRAHAM, RZ32 6ZD',
            dt: 'Address'
          }
        ],
        '86/811/4136': [
          {
            dd: 'Morton-on-Swale',
            dt: 'Parish'
          },
          {
            dd: '04/07/2022',
            dt: 'Start Date'
          },
          {
            dd: '31/12/9999',
            dt: 'End Date'
          },
          {
            dd: '276921, 643321',
            dt: 'Coordinates (x, y)'
          },
          {
            dd: 'CATTLE,PIGEONS,DEER,PIG(S)',
            dt: 'Species'
          },
          {
            dd: 'SOLUM VOMER FARM, ROBEL CHASE, PACOCHAHAMPTON, MX2 9LF',
            dt: 'Address'
          }
        ]
      },
      list: [
        {
          address: 'DAMNATIO CALCAR FARM, GOYETTE ROAD, LONG GRAHAM, RZ32 6ZD',
          cphNumber: '14/975/3854',
          endDate: '13/11/2027',
          parish: 'Aswardby',
          species: 'DEER,PIGEONS,SHEEP,POULTRY,GOAT(S),CATTLE,PIG(S),OTHER',
          startDate: '27/01/2021',
          xCoordinate: 580386,
          yCoordinate: 489268
        },
        {
          address: 'SOLUM VOMER FARM, ROBEL CHASE, PACOCHAHAMPTON, MX2 9LF',
          cphNumber: '86/811/4136',
          endDate: '31/12/9999',
          parish: 'Morton-on-Swale',
          species: 'CATTLE,PIGEONS,DEER,PIG(S)',
          startDate: '04/07/2022',
          xCoordinate: 276921,
          yCoordinate: 643321
        }
      ]
    })
  })
})
