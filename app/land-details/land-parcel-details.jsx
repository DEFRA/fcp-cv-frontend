'use client'

import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'
import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'

const coversColumns = [
  { header: 'Code', accessorKey: 'code', fixedWidth: 50 },
  { header: 'Land Cover', accessorKey: 'name' },
  { header: 'Area (ha)', accessorKey: 'area', fixedWidth: 95 }
]

const landUsesColumns = [
  { header: 'Code', accessorKey: 'code', fixedWidth: 50 },
  { header: 'Land Use', accessorKey: 'type' },
  { header: 'Start Date', accessorKey: 'startDate', fixedWidth: 90 },
  { header: 'End Date', accessorKey: 'endDate', fixedWidth: 90 },
  { header: 'Area (ha)', accessorKey: 'area', fixedWidth: 95 },
  { header: 'Length (m)', accessorKey: 'length', fixedWidth: 95 }
]

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function LandParcelDetails() {
  const { searchParams } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const date = searchParams.get('date') || todayISO()
  const sheetId = searchParams.get('sheetId')
  const parcelId = searchParams.get('parcelId')

  const { data, dalLoading } = useDal(
    [
      'land-parcel',
      `${sbi}?date=${date}&sheetId=${sheetId}&parcelId=${parcelId}`
    ],
    [sbi, sheetId, parcelId]
  )

  if (!sheetId || !parcelId) {
    return null
  }

  const parcel = data?.parcel || {}
  const parcelCovers = data?.parcelCovers || []
  const parcelLandUses = data?.parcelLandUses || []

  const pendingLabel =
    parcel.pendingDigitisation != null
      ? parcel.pendingDigitisation
        ? 'Yes'
        : 'No'
      : ''

  return (
    <div className="mt-4 ml-4 mr-4 space-y-6">
      <KeyValueList>
        <KeyValueListTitle loading={dalLoading}>
          {sheetId} {parcelId}
        </KeyValueListTitle>
        <KeyValueListContent>
          <KeyValueListItem
            dt="Area (ha)"
            dd={parcel.area ?? ''}
            loading={dalLoading}
          />
          <KeyValueListItem
            dt="Pending Customer Notified Land Change?"
            dd={pendingLabel}
            loading={dalLoading}
          />
          <KeyValueListItem
            dt="Effective Date From"
            dd={parcel.effectiveFromDate ?? ''}
            loading={dalLoading}
          />
          <KeyValueListItem
            dt="Effective Date To"
            dd={parcel.effectiveToDate ?? ''}
            loading={dalLoading}
          />
        </KeyValueListContent>
      </KeyValueList>
      <Table
        data={parcelCovers}
        columns={coversColumns}
        loading={dalLoading}
        enableSearching={false}
        noResultsMessage="No land covers found"
        enableSorting={false}
      />
      <Table
        data={parcelLandUses}
        columns={landUsesColumns}
        loading={dalLoading}
        enableSearching={false}
        noResultsMessage="No land uses found"
        enableSorting={false}
      />
    </div>
  )
}
