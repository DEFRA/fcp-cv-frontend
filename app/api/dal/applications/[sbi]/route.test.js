import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Applications API route', () => {
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
    vi.mocked(dalRequest).mockResolvedValue({})

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

  test('should return applications', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          applications: [
            {
              id: '5836775937',
              year: 2022,
              name: 'VOX CURRUS DELEO PEIOR CUNABULA AGNITIO CUR DEMO',
              scheme: 'CIVITAS THECA PAUCI ACER SUNT VALETUDO',
              status: 'PAID',
              submissionDate: '2022-12-31T22:01:36.356Z',
              portalStatus: null,
              agreementReferences: ['3242226112'],
              transitionHistory: [
                {
                  name: 'TO PAID',
                  timestamp: '2022-12-31T06:30:16.953Z'
                }
              ]
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
      list: [
        {
          id: '5836775937',
          year: 2022,
          name: 'VOX CURRUS DELEO PEIOR CUNABULA AGNITIO CUR DEMO',
          status: 'PAID',
          scheme: 'CIVITAS THECA PAUCI ACER SUNT VALETUDO',
          agreementReferences: '3242226112'
        }
      ],
      details: {
        5836775937: {
          name: 'VOX CURRUS DELEO PEIOR CUNABULA AGNITIO CUR DEMO',
          summary: [
            { dt: 'Application ID', dd: '5836775937' },
            { dt: 'Scheme', dd: 'CIVITAS THECA PAUCI ACER SUNT VALETUDO' },
            { dt: 'Year', dd: 2022 },
            { dt: 'Status', dd: 'PAID' },
            { dt: 'Status (Portal)', dd: null },
            { dt: 'Submitted Date', dd: '31/12/2022' },
            { dt: 'Agreement References', dd: '3242226112' },
            { dt: 'Last Movement', dd: 'TO PAID' },
            { dt: 'Last Movement Date/Time', dd: '31/12/2022 06:30' }
          ],
          movementHistory: [
            {
              name: 'TO PAID',
              timestamp: '2022-12-31T06:30:16.953Z',
              formattedDate: '31/12/2022 06:30'
            }
          ]
        }
      }
    })
  })

  test('should join multiple agreement references with comma and space', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          applications: [
            {
              id: '5836775937',
              year: 2022,
              name: 'TEST APPLICATION',
              scheme: 'TEST SCHEME',
              status: 'PAID',
              submissionDate: '2022-12-31T22:01:36.356Z',
              portalStatus: null,
              agreementReferences: ['123', '456'],
              transitionHistory: [
                {
                  name: 'TO PAID',
                  timestamp: '2022-12-31T06:30:16.953Z'
                }
              ]
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(
      result.details['5836775937'].summary.find(
        (item) => item.dt === 'Agreement References'
      ).dd
    ).toBe('123, 456')
  })

  test('should return empty list and details when dal response is missing data', async () => {
    vi.mocked(dalRequest).mockResolvedValue({})

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(await response.json()).toStrictEqual({ list: [], details: {} })
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
    expect(await response.json()).toEqual({ list: [], details: {} })
  })

  test('should return 500 if DAL request throws error', async () => {
    vi.mocked(dalRequest).mockRejectedValue(new Error('DAL error'))

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(500)
  })

  test('should return empty string for null submissionDate', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          applications: [
            {
              id: '5836775937',
              year: 2022,
              name: 'TEST APPLICATION',
              scheme: 'TEST SCHEME',
              status: 'PAID',
              submissionDate: null,
              portalStatus: null,
              agreementReferences: ['3242226112'],
              transitionHistory: [
                {
                  name: 'TO PAID',
                  timestamp: '2022-12-31T06:30:16.953Z'
                }
              ]
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    const result = await response.json()
    const submittedDate = result.details['5836775937'].summary.find(
      (item) => item.dt === 'Submitted Date'
    )
    expect(submittedDate.dd).toBe('')
  })

  test('should sort applications by year descending', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          applications: [
            {
              id: '1',
              year: '2020',
              name: 'App 2020',
              scheme: 'Scheme A',
              status: 'PAID',
              submissionDate: '2020-12-31T22:01:36.356Z',
              portalStatus: null,
              agreementReferences: ['111'],
              transitionHistory: [
                {
                  name: 'TO PAID',
                  timestamp: '2020-12-31T06:30:16.953Z'
                }
              ]
            },
            {
              id: '2',
              year: '2022',
              name: 'App 2022',
              scheme: 'Scheme B',
              status: 'PAID',
              submissionDate: '2022-12-31T22:01:36.356Z',
              portalStatus: null,
              agreementReferences: ['222'],
              transitionHistory: [
                {
                  name: 'TO PAID',
                  timestamp: '2022-12-31T06:30:16.953Z'
                }
              ]
            },
            {
              id: '3',
              year: '2019',
              name: 'App 2019',
              scheme: 'Scheme C',
              status: 'PAID',
              submissionDate: '2019-12-31T22:01:36.356Z',
              portalStatus: null,
              agreementReferences: ['333'],
              transitionHistory: [
                {
                  name: 'TO PAID',
                  timestamp: '2019-12-31T06:30:16.953Z'
                }
              ]
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ sbi: 'sbiParam' })
    })

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.list).toHaveLength(3)
    expect(result.list[0].year).toBe('2022')
    expect(result.list[1].year).toBe('2020')
    expect(result.list[2].year).toBe('2019')
  })
})
