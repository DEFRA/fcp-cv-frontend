import { useSearchParams } from '@/hooks/search-params'
import { useEffect } from 'react'

function useSelectOnlyTableRow(data, paramMappings) {
  const { searchParams, setSearchParams } = useSearchParams()

  useEffect(() => {
    if (data?.length === 1) {
      const paramsToSet = {}

      for (const { key, param } of paramMappings) {
        if (!searchParams.get(param)) {
          paramsToSet[param] = data[0][key]
        }
      }

      if (Object.keys(paramsToSet).length > 0) {
        setSearchParams(paramsToSet)
      }
    }
  }, [data, searchParams, setSearchParams, paramMappings])
}

export function useSelectOnlyTableRowByCRN(data) {
  useSelectOnlyTableRow(data, [{ key: 'crn', param: 'crn' }])
}

export function useSelectOnlyTableRowBySBI(data) {
  useSelectOnlyTableRow(data, [{ key: 'sbi', param: 'sbi' }])
}

export function useSelectOnlyTableRowByMessageId(data) {
  useSelectOnlyTableRow(data, [{ key: 'id', param: 'messageId' }])
}

export function useSelectOnlyTableRowByParcel(data) {
  useSelectOnlyTableRow(data, [
    { key: 'sheetId', param: 'sheetId' },
    { key: 'parcelId', param: 'parcelId' }
  ])
}
