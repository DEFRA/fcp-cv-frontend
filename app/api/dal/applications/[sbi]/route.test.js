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
    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
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
              sbi: '1111111111',
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
                  id: '6338450300',
                  name: 'TO PAID',
                  timestamp: '2022-12-31T06:30:16.953Z',
                  checkStatus: 'PASSED'
                }
              ]
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual({
      list: [
        {
          id: '5836775937',
          year: 2022,
          name: 'VOX CURRUS DELEO PEIOR CUNABULA AGNITIO CUR DEMO',
          status: 'PAID'
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
            { dt: 'Agreement References', dd: ['3242226112'] },
            { dt: 'Last Movement', dd: 'TO PAID' },
            { dt: 'Last Movement Date/Time', dd: '31/12/2022' }
          ],
          movementHistory: [
            {
              id: '6338450300',
              name: 'TO PAID',
              timestamp: '2022-12-31T06:30:16.953Z',
              checkStatus: 'PASSED'
            }
          ]
        }
      }
    })
  })
})
