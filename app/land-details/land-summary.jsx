'use client'

import { DatePicker } from '@/components/date-picker/date-picker'
import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'
import { notification } from '@/components/notification/Notifications'
import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { formatDate } from '@/lib/formatters'

const landCoverColumns = [
  { header: 'Code', accessorKey: 'code', fixedWidth: 50 },
  { header: 'Land Cover', accessorKey: 'name' },
  { header: 'Area (ha)', accessorKey: 'area', fixedWidth: 95 }
]

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function LandSummary() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParams } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const date = searchParams.get('date') || todayISO()

  const { data, isLoading } = useDal(
    ['land-details', `${sbi}?date=${date}`],
    [sbi]
  )

  const summary = data?.summary || {}

  return (
    <div className="p-4 space-y-4">
      <DatePicker
        value={date}
        onChange={(newDate) => setSearchParams({ date: newDate })}
        onInvalidDate={(reason, boundaryDate) => {
          const label = reason === 'below' ? 'minimum' : 'maximum'
          notification.warning(
            `Date is before the ${label} allowed date. It has been reset to the ${label} date: ${formatDate(boundaryDate)}.`
          )
        }}
      />

      <div className="grid grid-cols-2 gap-8">
        <KeyValueList>
          <KeyValueListTitle>Land Summary</KeyValueListTitle>
          <KeyValueListContent>
            <KeyValueListItem
              dt="Total Number of Parcels"
              dd={summary.totalParcels ?? ''}
              loading={isLoading}
            />
            <KeyValueListItem
              dt="Total Area (ha)"
              dd={summary.totalArea ?? ''}
              loading={isLoading}
            />
            <KeyValueListItem
              dt="Total Parcels With Pending Customer Notified Land Changes"
              dd={summary.pendingParcels ?? ''}
              loading={isLoading}
            />
          </KeyValueListContent>
        </KeyValueList>
        <Table
          data={data?.landCovers}
          columns={landCoverColumns}
          enableSearching={false}
          enableSorting={false}
          noResultsMessage="No land cover data"
        />
      </div>
    </div>
  )
}
