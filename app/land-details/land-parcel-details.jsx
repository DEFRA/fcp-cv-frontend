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
import { useEffect } from 'react'
import { notification } from '@/components/notification/Notifications.jsx'

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

  const { data, isLoading } = useDal(
    [
      'land-parcel',
      `${sbi}?date=${date}&sheetId=${sheetId}&parcelId=${parcelId}`
    ],
    [sbi, sheetId, parcelId]
  )
  useEffect(() => {
    if (!isLoading && sbi && sheetId && parcelId && !data) {
      notification.error(
        `No land parcel found for business with SBI ${sbi} Sheet ID ${sheetId} and Parcel ID ${parcelId}.`
      )
    }
  }, [data, isLoading, sbi, sheetId, parcelId])

  if (!sheetId || !parcelId) {
    return (
      <div className="mt-4 ml-4 mr-4 text-2xl font-semibold text-center text-gray-500">
        Select a parcel from the table
      </div>
    )
  }

  const parcel = data?.parcel || {}

  const pendingLabel =
    parcel.pendingDigitisation != null
      ? parcel.pendingDigitisation
        ? 'Yes'
        : 'No'
      : ''

  return (
    <div className="mt-4 ml-4 mr-4 space-y-6">
      <KeyValueList>
        <KeyValueListTitle loading={isLoading}>
          {sheetId} {parcelId}
        </KeyValueListTitle>
        <KeyValueListContent>
          <KeyValueListItem
            dt="Area (ha)"
            dd={parcel.area ?? ''}
            loading={isLoading}
          />
          <KeyValueListItem
            dt="Pending Customer Notified Land Change?"
            dd={pendingLabel}
            loading={isLoading}
          />
          <KeyValueListItem
            dt="Effective Date From"
            dd={parcel.effectiveFromDate ?? ''}
            loading={isLoading}
          />
          <KeyValueListItem
            dt="Effective Date To"
            dd={parcel.effectiveToDate ?? ''}
            loading={isLoading}
          />
        </KeyValueListContent>
      </KeyValueList>
      <Table
        data={data?.parcelCovers}
        columns={coversColumns}
        skeletonRows={2}
        enableSearching={false}
        noResultsMessage="No land covers found"
        enableSorting={false}
      />
      <Table
        data={data?.parcelLandUses}
        columns={landUsesColumns}
        skeletonRows={2}
        enableSearching={false}
        noResultsMessage="No land uses found"
        enableSorting={false}
      />
    </div>
  )
}
