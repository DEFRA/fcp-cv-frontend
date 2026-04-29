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
import { formatCurrency, formatDate } from '@/lib/formatters'

const lineItemColumns = [
  {
    header: 'Agreement / Claim No.',
    accessorKey: 'agreementClaimNo',
    cell: (props) => {
      const [agreementReference, claimNumber] = (props.getValue() ?? '').split(
        '/'
      )
      return (
        <span className="tabular-nums">
          <div>{agreementReference}</div>
          <div>{claimNumber}</div>
        </span>
      )
    }
  },
  { header: 'Scheme', accessorKey: 'scheme' },
  { header: 'Marketing Year', accessorKey: 'marketingYear' },
  { header: 'Description', accessorKey: 'description' },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: (props) => (
      <span className="tabular-nums">{formatCurrency(props.getValue())}</span>
    )
  }
]

export function PaymentsDetails() {
  const { searchParams } = useSearchParams()
  const sbi = searchParams.get('sbi')
  const paymentRef = searchParams.get('paymentRef')

  const { data, isLoading } = useDal(['payments', sbi])

  if (!isLoading && data?.payments?.length === 0) {
    return (
      <div className="m-20 text-2xl font-semibold text-center text-gray-500">
        No payments found
      </div>
    )
  }

  const payment = data?.payments?.find((p) => p.reference === paymentRef)

  const summary = payment
    ? [
        { dt: 'Amount', dd: formatCurrency(payment.amount) },
        { dt: 'Date', dd: formatDate(payment.date) }
      ]
    : [{ dt: 'Amount' }, { dt: 'Date' }]

  return (
    <div className="space-y-6">
      <KeyValueList>
        <KeyValueListTitle loading={isLoading}>
          {payment?.reference}
        </KeyValueListTitle>
        <KeyValueListContent>
          {summary.map((item) => (
            <KeyValueListItem key={item.dt} loading={isLoading} {...item} />
          ))}
        </KeyValueListContent>
      </KeyValueList>

      <div>
        <h3 className="text-xl font-bold mb-3">Line Items</h3>
        <Table
          data={payment?.lineItems}
          columns={lineItemColumns}
          enableSorting={false}
          enableSearching={false}
          noResultsMessage="No line items found"
        />
      </div>
    </div>
  )
}
