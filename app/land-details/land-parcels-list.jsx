'use client'

import { useEffect } from 'react'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { useSelectOnlyTableRowByCRN } from '@/hooks/select-only-table-row'

const columns = [
  { header: 'Sheet', accessorKey: 'sheetId' },
  { header: 'Parcel', accessorKey: 'parcelId' },
  { header: 'Area (ha)', accessorKey: 'area' },
  { header: 'Land Change?', accessorKey: 'pendingDigitisation' }
]

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function LandParcelsList() {
  const { searchParams, setSearchParams } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const date = searchParams.get('date') || todayISO()

  const { data } = useDal(['land-details', `${sbi}?date=${date}`], [sbi])

  useSelectOnlyTableRowByCRN(data)

  useEffect(() => {
    const firstParcel = Array.isArray(data?.parcels) && data.parcels[0]
    if (!firstParcel) return
    if (!searchParams.get('sheetId') && !searchParams.get('parcelId')) {
      setSearchParams({
        sheetId: firstParcel.sheetId,
        parcelId: firstParcel.parcelId
      })
    }
  }, [data, searchParams, setSearchParams])

  return (
    <div className="mt-4 ml-4">
      <Table
        data={data?.parcels}
        columns={columns}
        onRowClick={(row) => {
          setSearchParams({
            sheetId: row.sheetId,
            parcelId: row.parcelId,
            pendingDigitisation: row.pendingDigitisation ? 'Yes' : 'No'
          })
        }}
        selectedRow={`${searchParams.get('sheetId')}-${searchParams.get('parcelId')}`}
        selectedRowAccessorKey="id"
        noResultsMessage="No parcels found"
        enableSorting={false}
      />
    </div>
  )
}
