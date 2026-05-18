'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useSelectOnlyTableRowByPaymentId } from '@/hooks/select-only-table-row'
import { useEffect } from 'react'
import { notification } from '@/components/notification/Notifications'

const columns = [
  {
    accessorKey: 'id'
  },
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
  const selectedPaymentId = searchParams.get('paymentId')

  const { data, error, isLoading } = useDal(['payments', sbi])

  useSelectOnlyTableRowByPaymentId(data?.payments)

  useEffect(() => {
    if (!isLoading && error?.handleNotification) {
      notification.error(`Business with SBI ${sbi} not found.`)
    }
  }, [data, isLoading, sbi, error])

  return (
    <div className="space-y-4">
      {data && (
        <p>
          <span className="font-bold">On Hold:</span>{' '}
          {data.onHold ? 'Yes' : 'No'}
        </p>
      )}

      <Table
        data={error ? [] : data?.payments}
        columns={columns}
        onRowClick={(row) => setSearchParams({ paymentId: row.id })}
        onClearClick={() => unsetSearchParam('paymentId')}
        enableSorting={false}
        selectedRow={selectedPaymentId}
        selectedRowAccessorKey="id"
        noResultsMessage="No payments found"
        columnVisibility={{ id: false }}
      />
    </div>
  )
}
