'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useEffect, useMemo } from 'react'
import { notification } from '@/components/notification/Notifications.jsx'

const columns = [
  {
    header: 'Reference',
    accessorKey: 'reference',
    cell: (props) => <span className="tabular-nums">{props.getValue()}</span>
  },
  {
    header: 'Date',
    accessorKey: 'date',
    cell: (props) => formatDate(props.getValue())
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: (props) => (
      <span className="tabular-nums">{formatCurrency(props.getValue())}</span>
    )
  }
]

export function PaymentsList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParams, unsetSearchParam } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const selectedReference = searchParams.get('paymentRef')

  const { data, isLoading, error } = useDal(['payments', sbi])

  useEffect(() => {
    if (!isLoading && error?.handleNotification) {
      notification.error(`Business with SBI ${sbi} not found.`)
    }
  }, [data, isLoading, sbi, error])

  const sortedPayments = useMemo(() => {
    if (!data?.payments) return undefined
    return [...data.payments].sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  useEffect(() => {
    if (!sortedPayments?.length || selectedReference) return
    setSearchParams({ paymentRef: sortedPayments[0].reference })
  }, [sortedPayments, selectedReference, setSearchParams])

  return (
    <div className="space-y-4">
      {data && (
        <p>
          <span className="font-bold">On Hold:</span>{' '}
          {data.onHold ? 'Yes' : 'No'}
        </p>
      )}

      <Table
        data={error ? [] : sortedPayments}
        columns={columns}
        onRowClick={(row) => setSearchParams({ paymentRef: row.reference })}
        onClearClick={() => unsetSearchParam('paymentRef')}
        enableSorting={false}
        selectedRow={selectedReference}
        selectedRowAccessorKey="reference"
        noResultsMessage="No payments found"
      />
    </div>
  )
}
