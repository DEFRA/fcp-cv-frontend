import { dalRequest } from '@/lib/dal'
import { NextRequest } from 'next/server.js'
import { vi } from 'vitest'

import { GET } from './route'

describe('Agreements API route', () => {
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
    vi.mocked(dalRequest).mockResolvedValue({
      data: { business: { agreements: [] } }
    })

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

  test('should return empty list and details when no agreements', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: { business: { agreements: [] } }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(await response.json()).toStrictEqual({ list: [], details: {} })
  })

  test('should map agreement fields to list and detail shapes', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          agreements: [
            {
              contractId: 'AG00001234',
              name: 'Countryside Stewardship Agreement',
              status: 'Active',
              contractType: 'Higher Tier',
              schemeYear: 2023,
              startDate: '2023-01-01',
              endDate: '2027-12-31',
              paymentSchedules: []
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(await response.json()).toStrictEqual({
      list: [
        {
          contractId: 'AG00001234',
          name: 'Countryside Stewardship Agreement',
          status: 'Active',
          contractType: 'Higher Tier',
          schemeYear: 2023,
          startDate: '01/01/2023',
          endDate: '31/12/2027'
        }
      ],
      details: {
        AG00001234: {
          name: 'Countryside Stewardship Agreement',
          summary: [
            { dt: 'Agreement Reference', dd: 'AG00001234' },
            { dt: 'Status', dd: 'Active' },
            { dt: 'Type', dd: 'Higher Tier' },
            { dt: 'Start Date', dd: '01/01/2023' },
            { dt: 'Scheme Year', dd: 2023 },
            { dt: 'End Date', dd: '31/12/2027' }
          ],
          paymentSchedules: []
        }
      }
    })
  })

  test('should sort agreements by startDate descending', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          agreements: [
            {
              contractId: 'AG00000001',
              name: 'Oldest Agreement',
              status: 'Expired',
              contractType: 'Mid Tier',
              schemeYear: 2019,
              startDate: '2019-03-01',
              endDate: '2023-02-28',
              paymentSchedules: []
            },
            {
              contractId: 'AG00000003',
              name: 'Newest Agreement',
              status: 'Active',
              contractType: 'Higher Tier',
              schemeYear: 2024,
              startDate: '2024-01-01',
              endDate: '2028-12-31',
              paymentSchedules: []
            },
            {
              contractId: 'AG00000002',
              name: 'Middle Agreement',
              status: 'Active',
              contractType: 'Mid Tier',
              schemeYear: 2021,
              startDate: '2021-06-15',
              endDate: '2025-06-14',
              paymentSchedules: []
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    const { list } = await response.json()
    expect(list.map((a) => a.contractId)).toStrictEqual([
      'AG00000003',
      'AG00000002',
      'AG00000001'
    ])
  })

  test('should map payment schedule fields and sort by sheet, parcel, description, start and end date', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          agreements: [
            {
              contractId: 'AG00001234',
              name: 'Countryside Stewardship Agreement',
              status: 'Active',
              contractType: 'Higher Tier',
              schemeYear: 2023,
              startDate: '2023-01-01',
              endDate: '2027-12-31',
              paymentSchedules: [
                {
                  optionCode: 'OP2',
                  optionDescription: 'Wildflower strips',
                  commitmentGroupStartDate: '2023-01-01',
                  commitmentGroupEndDate: '2027-12-31',
                  year: 2023,
                  sheetName: 'SY1234',
                  parcelName: '0002',
                  actionArea: 1.5,
                  actionMTL: null,
                  actionUnits: 2,
                  parcelTotalArea: 3.2,
                  startDate: '2023-01-01',
                  endDate: '2023-12-31'
                },
                {
                  optionCode: 'OP1',
                  optionDescription: 'Arable field margins',
                  commitmentGroupStartDate: '2023-01-01',
                  commitmentGroupEndDate: '2027-12-31',
                  year: 2023,
                  sheetName: 'SY1234',
                  parcelName: '0001',
                  actionArea: 0.8,
                  actionMTL: 120,
                  actionUnits: 1,
                  parcelTotalArea: 2.1,
                  startDate: '2023-01-01',
                  endDate: '2023-12-31'
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

    const { details } = await response.json()
    expect(details.AG00001234.paymentSchedules).toStrictEqual([
      {
        sheetName: 'SY1234',
        parcelName: '0001',
        optionDescription: 'Arable field margins',
        actionArea: 0.8,
        actionMTL: 120,
        actionUnits: 1,
        parcelTotalArea: 2.1,
        paymentSchedule: '01/01/2023 - 31/12/2023',
        commitmentTerm: '01/01/2023 - 31/12/2027'
      },
      {
        sheetName: 'SY1234',
        parcelName: '0002',
        optionDescription: 'Wildflower strips',
        actionArea: 1.5,
        actionMTL: null,
        actionUnits: 2,
        parcelTotalArea: 3.2,
        paymentSchedule: '01/01/2023 - 31/12/2023',
        commitmentTerm: '01/01/2023 - 31/12/2027'
      }
    ])
  })

  test('should handle null dates gracefully', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          agreements: [
            {
              contractId: 'AG00009999',
              name: 'Agreement with null dates',
              status: null,
              contractType: null,
              schemeYear: null,
              startDate: null,
              endDate: null,
              paymentSchedules: [
                {
                  optionCode: 'OP1',
                  optionDescription: null,
                  commitmentGroupStartDate: null,
                  commitmentGroupEndDate: null,
                  year: null,
                  sheetName: null,
                  parcelName: null,
                  actionArea: null,
                  actionMTL: null,
                  actionUnits: null,
                  parcelTotalArea: null,
                  startDate: null,
                  endDate: null
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

    const { list, details } = await response.json()
    expect(list[0].startDate).toBe('01/01/1970')
    expect(list[0].endDate).toBe('01/01/1970')
    expect(details.AG00009999.paymentSchedules[0].paymentSchedule).toBe(
      '01/01/1970 - 01/01/1970'
    )
    expect(details.AG00009999.paymentSchedules[0].commitmentTerm).toBe(
      '01/01/1970 - 01/01/1970'
    )
  })

  test('should return empty list and details when dal response is missing data', async () => {
    vi.mocked(dalRequest).mockResolvedValue({})

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(await response.json()).toStrictEqual({ list: [], details: {} })
  })

  test('should sort agreements with null startDate using empty string fallback', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          agreements: [
            {
              contractId: 'AG00000001',
              name: 'Agreement with 2023 date',
              status: 'Active',
              contractType: 'Higher Tier',
              schemeYear: 2023,
              startDate: '2023-01-01',
              endDate: '2027-12-31',
              paymentSchedules: []
            },
            {
              contractId: 'AG00000002',
              name: 'Agreement without date',
              status: 'Active',
              contractType: 'Mid Tier',
              schemeYear: 2022,
              startDate: null,
              endDate: null,
              paymentSchedules: null
            },
            {
              contractId: 'AG00000003',
              name: 'Agreement with 2022 date',
              status: 'Active',
              contractType: 'Mid Tier',
              schemeYear: 2022,
              startDate: '2022-06-01',
              endDate: '2026-05-31',
              paymentSchedules: []
            }
          ]
        }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(response.status).toBe(200)
    const { list } = await response.json()
    expect(list).toHaveLength(3)
    expect(list[0].contractId).toBe('AG00000001')
    expect(list[list.length - 1].contractId).toBe('AG00000002')
  })

  test('should sort payment schedules with null fields using empty string fallback', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          agreements: [
            {
              contractId: 'AG00001234',
              name: 'Countryside Stewardship Agreement',
              status: 'Active',
              contractType: 'Higher Tier',
              schemeYear: 2023,
              startDate: '2023-01-01',
              endDate: '2027-12-31',
              paymentSchedules: [
                {
                  optionCode: 'OP2',
                  optionDescription: 'Wildflower strips',
                  commitmentGroupStartDate: '2023-01-01',
                  commitmentGroupEndDate: '2027-12-31',
                  year: 2023,
                  sheetName: null,
                  parcelName: '0002',
                  actionArea: 1.5,
                  actionMTL: null,
                  actionUnits: 2,
                  parcelTotalArea: 3.2,
                  startDate: '2023-01-01',
                  endDate: '2023-12-31'
                },
                {
                  optionCode: 'OP1',
                  optionDescription: 'Arable field margins',
                  commitmentGroupStartDate: '2023-01-01',
                  commitmentGroupEndDate: '2027-12-31',
                  year: 2023,
                  sheetName: null,
                  parcelName: '0001',
                  actionArea: 0.8,
                  actionMTL: 120,
                  actionUnits: 1,
                  parcelTotalArea: 2.1,
                  startDate: '2023-01-01',
                  endDate: '2023-12-31'
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
    const { details } = await response.json()
    expect(details.AG00001234.paymentSchedules[0].parcelName).toBe('0001')
    expect(details.AG00001234.paymentSchedules[1].parcelName).toBe('0002')
  })

  test('should preserve original order when payment schedules are equal across all sort fields', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      data: {
        business: {
          agreements: [
            {
              contractId: 'AG00001234',
              name: 'Countryside Stewardship Agreement',
              status: 'Active',
              contractType: 'Higher Tier',
              schemeYear: 2023,
              startDate: '2023-01-01',
              endDate: '2027-12-31',
              paymentSchedules: [
                {
                  optionCode: 'OP1',
                  optionDescription: 'Arable field margins',
                  commitmentGroupStartDate: '2023-01-01',
                  commitmentGroupEndDate: '2027-12-31',
                  year: 2023,
                  sheetName: 'SY1234',
                  parcelName: '0001',
                  actionArea: 0.8,
                  actionMTL: 120,
                  actionUnits: 1,
                  parcelTotalArea: 2.1,
                  startDate: '2023-01-01',
                  endDate: '2023-12-31'
                },
                {
                  optionCode: 'OP1',
                  optionDescription: 'Arable field margins',
                  commitmentGroupStartDate: '2023-01-01',
                  commitmentGroupEndDate: '2027-12-31',
                  year: 2024,
                  sheetName: 'SY1234',
                  parcelName: '0001',
                  actionArea: 1.2,
                  actionMTL: 80,
                  actionUnits: 2,
                  parcelTotalArea: 3.0,
                  startDate: '2023-01-01',
                  endDate: '2023-12-31'
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

    const { details } = await response.json()
    expect(details.AG00001234.paymentSchedules).toHaveLength(2)
    expect(details.AG00001234.paymentSchedules[0].actionArea).toBe(0.8)
    expect(details.AG00001234.paymentSchedules[1].actionArea).toBe(1.2)
  })

  test('should fail fast when DAL response code indicates an error has occurred', async () => {
    vi.mocked(dalRequest).mockResolvedValue({
      status: 400,
      statusText: 'Invalid request',
      json: async () => {
        return { error: 'Some error occurred' }
      }
    })

    const response = await GET(new NextRequest('http://localhost'), {
      params: new Promise((resolve) => resolve({ sbi: 'sbiParam' }))
    })

    expect(response).toMatchObject({
      status: 400,
      statusText: 'Invalid request'
    })
    expect(await response.json()).toMatchObject({
      error: 'Some error occurred'
    })
  })
})
