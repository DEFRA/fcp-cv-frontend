'use client'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Transition } from '@headlessui/react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

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

  const { searchParams, setSearchParams } = useSearchParams()
  const setSearchParamsRef = useRef(setSearchParams)
  useLayoutEffect(() => {
    setSearchParamsRef.current = setSearchParams
  })

  const sbi = searchParams.get('sbi')
  const selectedReference = searchParams.get('paymentRef')

  const [searchTerm, setSearchTerm] = useState('')

  const { data } = useDal(['payments', sbi])

  // TODO Add useEffect here to handle data not found error

  const sortedPayments = useMemo(() => {
    if (!data?.payments) return undefined
    return [...data.payments].sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  const filteredPayments = useMemo(() => {
    if (!sortedPayments) return undefined
    if (!searchTerm) return sortedPayments
    const term = searchTerm.toLowerCase()
    return sortedPayments.filter((p) =>
      p.reference.toLowerCase().includes(term)
    )
  }, [sortedPayments, searchTerm])

  useEffect(() => {
    if (!filteredPayments?.length) return
    setSearchParamsRef.current({ paymentRef: filteredPayments[0].reference })
  }, [filteredPayments])

  return (
    <div className="space-y-4">
      {data && (
        <p>
          <span className="font-bold">On Hold:</span>{' '}
          {data.onHold ? 'Yes' : 'No'}
        </p>
      )}

      <div className="mb-2 flex items-center gap-10">
        <label className="font-bold" htmlFor="payments-search">
          Search
        </label>
        <div className="relative ml-auto w-full max-w-3xl">
          <input
            id="payments-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term"
            className="ml-auto w-full max-w-3xl border-2 border-green-700 p-2 placeholder-gray-500 focus:outline-none focus:ring-green-700 pr-12"
          />
          <Transition
            show={!!searchTerm}
            enter="transition-opacity duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700 leading-none cursor-pointer"
              type="button"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </button>
          </Transition>
        </div>
      </div>

      <Table
        data={filteredPayments}
        columns={columns}
        onRowClick={(row) => setSearchParams({ paymentRef: row.reference })}
        enableSorting={false}
        enableSearching={false}
        selectedRow={selectedReference}
        selectedRowAccessorKey="reference"
        noResultsMessage="No payments found"
      />
    </div>
  )
}
