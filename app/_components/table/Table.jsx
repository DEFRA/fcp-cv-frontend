'use client'

import { Skeleton } from '@/components/skeleton/skeleton'
import { cn } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useId, useMemo, useState } from 'react'

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

function SearchBar({
  value = '',
  onChange,
  searchBarClassName = '',
  onClearClick = () => {}
}) {
  const uniqueId = `search-${useId()}`

  return (
    <div className="mb-2 flex items-center gap-10">
      <label className="font-bold" htmlFor={uniqueId}>
        Search
      </label>

      <div
        className={cn('relative ml-auto w-full max-w-3xl', searchBarClassName)}
      >
        <input
          id={uniqueId}
          value={value}
          onChange={onChange}
          placeholder="Enter search term"
          className="ml-auto w-full max-w-3xl border-2 border-green-700 p-2 placeholder-gray-500 focus:outline-none focus:ring-green-700 pr-12"
        />

        <Transition
          show={!!value}
          enter="transition-opacity duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <button
            onClick={() => {
              onChange({ target: { value: '' } })
              onClearClick()
            }}
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
  )
}

function getFixedWidthStyle({ fixedWidth }) {
  return fixedWidth !== undefined ? { width: `${fixedWidth}px` } : undefined
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
        'border-r border-white p-2 text-left font-bold text-white last:border-r-0',
      ...(sortable ? { 'aria-sort': ariaSort } : {}),
      style: getFixedWidthStyle(header.column.columnDef)
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

function Row({ row, onRowClick, selectedRow, selectedRowAccessorKey }) {
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

  const isSelected =
    selectedRow !== undefined &&
    selectedRowAccessorKey &&
    row.original[selectedRowAccessorKey] === selectedRow

  let rowClassName = isSelected ? 'bg-green-100/70' : ''
  if (isRowClickable) {
    rowClassName +=
      ' cursor-pointer transition-colors hover:bg-green-100/70 focus-visible:outline-none focus-visible:ring-green-500'
  }

  return (
    <tr
      className={rowClassName}
      onClick={isRowClickable ? handleRowClick : undefined}
      onKeyDown={isRowClickable ? handleRowKeyDown : undefined}
      tabIndex={isRowClickable ? 0 : undefined}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="px-1 py-2  text-gray-950"
          style={getFixedWidthStyle(cell.column.columnDef)}
        >
          <Skeleton
            loading={cell.getValue() === undefined}
            className="h-6 w-30"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Skeleton>
        </td>
      ))}
    </tr>
  )
}

export default function Table({
  data,
  columns = [],
  skeletonRows = 3,
  enableSearching = true,
  enableSorting = true,
  defaultSortColumn = columns[0]?.accessorKey,
  searchBarClassName = '',
  onRowClick,
  onClearClick,
  selectedRow,
  selectedRowAccessorKey,
  columnVisibility,
  defaultSortDirection = 'asc',
  noResultsMessage = 'No results found'
}) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState(() => {
    if (enableSorting) {
      return [
        {
          id: defaultSortColumn,
          desc: defaultSortDirection === 'desc' ? true : false
        }
      ]
    }
    return []
  })

  const skeletonData = useMemo(
    () => Array(skeletonRows).fill({}),
    [skeletonRows]
  )

  const state = {}
  if (enableSearching) {
    state.globalFilter = globalFilter
  }
  if (enableSorting) {
    state.sorting = sorting
  }

  const table = useReactTable({
    data: data || skeletonData,
    columns,
    onGlobalFilterChange: enableSearching ? setGlobalFilter : undefined,
    globalFilterFn: 'includesString',
    state,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableSearching ? getFilteredRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableSorting,
    initialState: {
      columnVisibility
    }
  })

  return (
    <div className="overflow-x-auto">
      {enableSearching && (
        <SearchBar
          searchBarClassName={searchBarClassName}
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          onClearClick={onClearClick}
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
                  {noResultsMessage}
                </td>
              </tr>
            ) : (
              table
                .getRowModel()
                .rows.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    onRowClick={onRowClick}
                    selectedRow={selectedRow}
                    selectedRowAccessorKey={selectedRowAccessorKey}
                  />
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
