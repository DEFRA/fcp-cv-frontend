import { useSearchParams } from '@/hooks/search-params'
import { useEffect } from 'react'

function useSelectOnlyTableRow(data, key, param) {
  const { searchParams, setSearchParams } = useSearchParams()

  useEffect(() => {
    if (data?.length === 1 && !searchParams.get(param)) {
      setSearchParams({ [param]: data[0][key] })
    }
  }, [data, searchParams, setSearchParams, param, key])
}

export function useSelectOnlyTableRowByCRN(data) {
  useSelectOnlyTableRow(data, 'crn', 'crn')
}

export function useSelectOnlyTableRowBySBI(data) {
  useSelectOnlyTableRow(data, 'sbi', 'sbi')
}

export function useSelectOnlyTableRowByMessageId(data) {
  useSelectOnlyTableRow(data, 'id', 'messageId')
}
