'use client'

import { useEffect, useMemo } from 'react'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'

const columns = [
  { header: 'Sheet', accessorKey: 'sheetId' },
  { header: 'Parcel', accessorKey: 'parcelId' },
  { header: 'Area (ha)', accessorKey: 'area' },
  {
    header: 'Land Change?',
    accessorKey: 'pendingDigitisation',
    cell: ({ getValue }) => (getValue() ? 'Yes' : 'No')
  }
]

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function LandParcelsList() {
  const { searchParams, setSearchParams } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const date = searchParams.get('date') || todayISO()

  const { data, dalLoading } = useDal(
    ['land-details', `${sbi}?date=${date}`],
    [sbi]
  )

  const parcels = useMemo(() => data?.parcels || [], [data?.parcels])

  useEffect(() => {
    const firstParcel = parcels[0]
    if (!firstParcel) return
    const current = new URLSearchParams(window.location.search)
    if (!current.get('sheetId') && !current.get('parcelId')) {
      setSearchParams({
        sheetId: firstParcel.sheetId,
        parcelId: firstParcel.parcelId
      })
    }
  }, [parcels, setSearchParams])

  return (
    <div className="mt-4 ml-4">
      <Table
        data={parcels}
        columns={columns}
        loading={dalLoading}
        onRowClick={(row) => {
          setSearchParams({ sheetId: row.sheetId, parcelId: row.parcelId })
        }}
        selectedRow={`${searchParams.get('sheetId')}-${searchParams.get('parcelId')}`}
        selectedRowAccessorKey="id"
        noResultsMessage="No parcels found"
        enableSorting={false}
      />
    </div>
  )
}
