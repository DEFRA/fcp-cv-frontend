'use client'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Suspense, useId, useState } from 'react'

function SortArrow({ direction }) {
  const isAsc = direction === 'asc'
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path
        d={isAsc ? 'M10 5l6 7H4l6-7z' : 'M10 15l-6-7h12l-6 7z'}
        fill="currentColor"
      />
    </svg>
  )
}

function SearchBar({ value = '', onChange = () => {} }) {
  const uniqueId = `search-${useId()}`

  return (
    <div className="mb-2 flex items-center gap-10">
      <label className="text-sm font-bold" htmlFor={uniqueId}>
        Search
      </label>
      <input
        id={uniqueId}
        value={value}
        onChange={onChange}
        placeholder="Enter search term"
        className="ml-auto w-full max-w-3xl border-2 border-green-700 p-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-green-700"
      />
    </div>
  )
}

function Header({ headerGroup }) {
  const sortableButton = (header) => (
    <button
      type="button"
      onClick={header.column.getToggleSortingHandler()}
      className="flex w-full cursor-pointer select-none items-center justify-between gap-3 text-left"
    >
      <span>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      {header.column.getIsSorted() ? (
        <span className="text-white">
          <SortArrow direction={header.column.getIsSorted()} />
        </span>
      ) : null}
    </button>
  )

  const rows = headerGroup.headers.map((header) => {
    const sortable = header.column.getCanSort()
    const ariaSort =
      header.column.getIsSorted() === 'asc' ? 'ascending' : 'descending'

    const props = {
      className:
        'border-r border-white p-2 text-left text-sm font-bold text-white last:border-r-0',
      ...(sortable ? { 'aria-sort': ariaSort } : {})
    }

    const content = sortable
      ? sortableButton(header)
      : flexRender(header.column.columnDef.header, header.getContext())

    return (
      <th key={header.id} {...props}>
        {content}
      </th>
    )
  })

  return <tr>{rows}</tr>
}

function Row({ row, onRowClick }) {
  const isRowClickable = typeof onRowClick === 'function'

  const handleRowClick = () => {
    onRowClick(row.original)
  }

  const handleRowKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleRowClick()
    }
  }

  let rowClassName = ''
  if (isRowClickable) {
    rowClassName =
      'cursor-pointer transition-colors hover:bg-green-100/70 focus-visible:outline-none focus-visible:ring-green-500'
  }

  return (
    <tr
      className={rowClassName}
      onClick={isRowClickable ? handleRowClick : undefined}
      onKeyDown={isRowClickable ? handleRowKeyDown : undefined}
      tabIndex={isRowClickable ? 0 : undefined}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-1 py-2 text-sm text-gray-950">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}

function TableInner({
  data = [],
  columns = [],
  enableSearching = true,
  enableSorting = true,
  defaultSortColumn = columns[0]?.accessorKey,
  onRowClick
}) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState(() => {
    if (enableSorting) {
      return [{ id: defaultSortColumn, desc: false }]
    }
    return []
  })

  const state = {}
  if (enableSearching) {
    state.globalFilter = globalFilter
  }
  if (enableSorting) {
    state.sorting = sorting
  }

  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: enableSearching ? setGlobalFilter : undefined,
    globalFilterFn: 'includesString',
    state,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableSearching ? getFilteredRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableSorting
  })

  return (
    <div className="overflow-x-auto">
      {enableSearching && (
        <SearchBar
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        />
      )}
      <div className="inline-block min-w-full overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-green-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <Header key={headerGroup.id} headerGroup={headerGroup} />
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr className="">
                <td
                  colSpan={Math.max(1, table.getAllLeafColumns().length)}
                  className="px-6 py-6 text-lg text-gray-950"
                >
                  No results found
                </td>
              </tr>
            ) : (
              table
                .getRowModel()
                .rows.map((row) => (
                  <Row key={row.id} row={row} onRowClick={onRowClick} />
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Table(props) {
  return (
    <Suspense fallback={<div>Loading table…</div>}>
      <TableInner {...props} />
    </Suspense>
  )
}
