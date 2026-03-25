import { expect, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'

import {
  useSelectOnlyTableRowByCRN,
  useSelectOnlyTableRowByMessageId,
  useSelectOnlyTableRowBySBI
} from '@/hooks/select-only-table-row'

// Mock the useSearchParams hook
vi.mock('@/hooks/search-params', () => ({
  useSearchParams: vi.fn()
}))

import { useSearchParams } from '@/hooks/search-params'

describe('useSelectOnlyTableRow Hooks', () => {
  let mockSearchParams
  let mockSetSearchParams

  beforeEach(() => {
    mockSearchParams = new URLSearchParams()
    mockSetSearchParams = vi.fn()

    useSearchParams.mockReturnValue({
      searchParams: mockSearchParams,
      setSearchParams: mockSetSearchParams
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe.each([
    [
      'useSelectOnlyTableRowByCRN',
      useSelectOnlyTableRowByCRN,
      'crn',
      'crn',
      '1234567890',
      'Test Contact'
    ],
    [
      'useSelectOnlyTableRowBySBI',
      useSelectOnlyTableRowBySBI,
      'sbi',
      'sbi',
      '123456789',
      'Test Business'
    ],
    [
      'useSelectOnlyTableRowByMessageId',
      useSelectOnlyTableRowByMessageId,
      'id',
      'messageId',
      'msg-12345',
      'Test Message'
    ]
  ])('%s', (hookName, hookFn, keyName, paramName, testValue, testName) => {
    it('sets search params when data has exactly one item and param does not exist', async () => {
      const data = [{ [keyName]: testValue, name: testName }]

      await renderHook(() => hookFn(data))

      expect(mockSetSearchParams).toHaveBeenCalledWith({
        [paramName]: testValue
      })
    })

    it(`does not set search params when data has exactly one item but ${paramName} already exists`, async () => {
      mockSearchParams.set(paramName, 'existing-value')
      const data = [{ [keyName]: testValue, name: testName }]

      await renderHook(() => hookFn(data))

      expect(mockSetSearchParams).not.toHaveBeenCalled()
    })

    it('does not set search params when data has multiple items', async () => {
      const data = [
        { [keyName]: testValue, name: `${testName} 1` },
        { [keyName]: 'second-value', name: `${testName} 2` }
      ]

      await renderHook(() => hookFn(data))

      expect(mockSetSearchParams).not.toHaveBeenCalled()
    })

    it('does not set search params when data is empty', async () => {
      const data = []

      await renderHook(() => hookFn(data))

      expect(mockSetSearchParams).not.toHaveBeenCalled()
    })

    it('does not set search params when data is null', async () => {
      const data = null

      await renderHook(() => hookFn(data))

      expect(mockSetSearchParams).not.toHaveBeenCalled()
    })

    it('does not set search params when data is undefined', async () => {
      const data = undefined

      await renderHook(() => hookFn(data))

      expect(mockSetSearchParams).not.toHaveBeenCalled()
    })
  })
})
