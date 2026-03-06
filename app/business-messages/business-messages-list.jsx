'use client'

import { useMemo, useState } from 'react'

import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useDataverseAccountIDToSBI } from '@/hooks/dataverse'
import { useSearchParams } from '@/hooks/search-params'
import { formatDate } from '@/lib/formatters'

const dateRangeOptions = [
  { label: 'Last 12 months', value: 12 },
  { label: 'Last 24 months', value: 24 },
  { label: 'Last 36 months', value: 36 },
  { label: 'All', value: 'all' }
]

const readFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Read', value: 'read' },
  { label: 'Unread', value: 'unread' }
]

function computeFromDate(months) {
  if (!months) return ''
  const date = new Date()
  date.setMonth(date.getMonth() - months)
  return date.toISOString().split('T')[0]
}

function FilterControls({
  contacts,
  contact,
  onContactChange,
  dateRange,
  onDateRangeChange,
  readFilter,
  onReadFilterChange
}) {
  const hasContact = Boolean(contact)
  const selectClassName =
    'w-full border-2 border-green-700 p-2 focus:outline-none focus:ring-green-700 disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="mb-4 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2">
      <label className="font-bold" htmlFor="contact-filter">
        Contact
      </label>
      <select
        id="contact-filter"
        className={selectClassName}
        value={contact}
        onChange={(e) => onContactChange(e.target.value)}
      >
        <option value="">Select a contact</option>
        {contacts.map((c) => (
          <option key={c.crn} value={c.crn}>
            {c.firstName} {c.lastName}
          </option>
        ))}
      </select>

      <label className="font-bold" htmlFor="date-range-filter">
        Date Range
      </label>
      <select
        id="date-range-filter"
        className={selectClassName}
        value={dateRange}
        disabled={!hasContact}
        onChange={(e) => onDateRangeChange(e.target.value)}
      >
        {dateRangeOptions.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label className="font-bold whitespace-nowrap" htmlFor="read-filter">
        Show Read/Unread
      </label>
      <select
        id="read-filter"
        className={selectClassName}
        value={readFilter}
        disabled={!hasContact}
        onChange={(e) => onReadFilterChange(e.target.value)}
      >
        {readFilterOptions.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function BusinessMessagesList() {
  useDataverseAccountIDToSBI()

  const { searchParams, setSearchParam } = useSearchParams()
  const [readFilter, setReadFilter] = useState('')

  const sbi = searchParams.get('sbi')
  const contact = searchParams.get('contact')
  const dateRange = searchParams.get('dateRange') || '24'
  const fromDate = computeFromDate(Number(dateRange))

  const { data: contacts = [] } = useDal(['business-messages', 'contacts', sbi])

  const messagesUrlSuffix = fromDate
    ? `${contact}?fromDate=${fromDate}`
    : contact

  const { data: messages = [] } = useDal(
    ['business-messages', 'messages', sbi, messagesUrlSuffix],
    [contact]
  )

  const filteredMessages = useMemo(() => {
    if (!readFilter) return messages
    return messages.filter((msg) =>
      readFilter === 'read' ? msg.read : !msg.read
    )
  }, [messages, readFilter])

  const columns = [
    {
      header: 'Status',
      accessorKey: 'read',
      cell: ({ getValue }) => (getValue() ? 'Read' : 'Unread')
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ getValue }) => formatDate(getValue())
    },
    { header: 'Subject', accessorKey: 'subject' }
  ]

  return (
    <div className="mt-4 ml-4">
      <FilterControls
        contacts={contacts}
        contact={contact || ''}
        onContactChange={(value) => setSearchParam('contact', value)}
        dateRange={dateRange}
        onDateRangeChange={(value) => setSearchParam('dateRange', value)}
        readFilter={readFilter}
        onReadFilterChange={setReadFilter}
      />
      {contact && (
        <Table
          data={filteredMessages}
          columns={columns}
          onRowClick={(row) => {
            setSearchParam('messageId', row.id)
          }}
          defaultSortColumn="date"
          defaultSortDirection="desc"
          noResultsMessage="No messages found"
          selectedRow={searchParams.get('messageId')}
          selectedRowAccessorKey="id"
        />
      )}
    </div>
  )
}
